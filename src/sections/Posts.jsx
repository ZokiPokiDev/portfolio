import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../base/posts';

const Posts = () => {
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  // Number of visible posts at once
  const visiblePosts = 4;
  const totalPosts = posts.length;
  const maxIndex = Math.max(0, totalPosts - visiblePosts);

  // Calculate slide position
  const getSlidePosition = (slideIndex) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.querySelector('.post-slide')?.offsetWidth || 280;
      const gap = 16; // px gap between slides
      return -slideIndex * (cardWidth + gap);
    }
    return 0;
  };

  // Auto-advance every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex(prev => (prev + 1) % (maxIndex + 1));
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isDragging, maxIndex]);

  // Mouse/touch drag handlers
  const handleDragStart = (e) => {
    // Only start drag if clicking on the slider track, not on a card
    if (e.target.closest('.post-card, .post-slide')) {
      return;
    }
    setIsDragging(true);
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (startX === null || !sliderRef.current) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startX;
    
    // Calculate new position based on drag
    const newPosition = getSlidePosition(currentIndex) + diff;
    sliderRef.current.style.transform = `translateX(${newPosition}px)`;
  };

  const handleDragEnd = (e) => {
    if (startX === null || !sliderRef.current) return;
    
    const clientX = e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX;
    const diff = startX - clientX; // Positive = swipe left, negative = swipe right
    
    const postWidth = containerRef.current?.querySelector('.post-slide')?.offsetWidth || 280;
    const slideWidth = postWidth + 16;
    const threshold = slideWidth / 3; // Swipe threshold

    let newIndex = currentIndex;
    
    if (Math.abs(diff) > threshold) {
      // Swipe left (next)
      if (diff > 0 && currentIndex < maxIndex) {
        newIndex = currentIndex + 1;
      }
      // Swipe right (previous)
      else if (diff < 0 && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
    }

    setCurrentIndex(newIndex);
    setIsDragging(false);
    setWasDragged(true);
    setStartX(null);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.3s ease';
    }
    
    // Clear the dragged flag after a short delay so next click works
    setTimeout(() => setWasDragged(false), 100);
  };

  // Navigation buttons
  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  return (
    <section 
      id="posts" 
      className="posts-section"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Posts slider"
    >
      <div className="posts-header">
        <div className="posts-title">
          <h2>Posts</h2>
          <p>Technical insights and learnings from real projects</p>
        </div>
        <div className="posts-nav">
          <button 
            type="button" 
            className="slider-nav prev"
            onClick={goToPrev}
            disabled={currentIndex === 0}
            aria-label="Previous posts"
          >
            ‹
          </button>
          <span className="posts-counter">
            {currentIndex + 1}-{Math.min(currentIndex + visiblePosts, totalPosts)} of {totalPosts}
          </span>
          <button 
            type="button" 
            className="slider-nav next"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next posts"
          >
            ›
          </button>
        </div>
      </div>

      <div 
        className="posts-slider-container"
        ref={containerRef}
      >
        <div
          className="posts-slider"
          ref={sliderRef}
          style={{
            transform: `translateX(${getSlidePosition(currentIndex)}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onClick={(e) => {
            // Prevent click on slider track from navigating
            if (e.target === e.currentTarget) {
              e.preventDefault();
            }
          }}
        >
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="post-slide"
              style={{
                opacity: isDragging ? 0.8 : 1,
                cursor: isDragging ? 'grabbing' : 'pointer'
              }}
            >
              <Link 
                to={`/posts/${post.slug}`}
                className="post-card"
                onClick={(e) => {
                  if (isDragging || wasDragged) {
                    e.preventDefault();
                    return false;
                  }
                }}
              >
                <div className="post-card-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <span className="post-read-more">
                    Read more
                    <span className="post-arrow">→</span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Progress indicator dots */}
      <div className="slider-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Posts;
