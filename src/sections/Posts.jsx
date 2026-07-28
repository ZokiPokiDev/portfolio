import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../base/posts';

const getVisiblePosts = () => {
  if (typeof window === 'undefined') return 4;

  if (window.matchMedia('(max-width: 599px)').matches) return 1;
  if (window.matchMedia('(max-width: 899px)').matches) return 2;
  if (window.matchMedia('(max-width: 1199px)').matches) return 3;
  return 4;
};

const ArrowIcon = ({ direction }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d={direction === 'previous' ? 'M11.75 4.5 6.25 10l5.5 5.5' : 'm8.25 4.5 5.5 5.5-5.5 5.5'} />
  </svg>
);

const Posts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(getVisiblePosts);
  const viewportRef = useRef(null);

  const totalPosts = posts.length;
  const maxIndex = Math.max(0, totalPosts - visiblePosts);
  const visibleEnd = Math.min(currentIndex + visiblePosts, totalPosts);
  const progress = maxIndex === 0 ? 100 : ((currentIndex / maxIndex) * 100);

  const getScrollStep = () => {
    const viewport = viewportRef.current;
    const card = viewport?.querySelector('.post-slide');
    if (!viewport || !card) return 0;

    const styles = window.getComputedStyle(viewport.querySelector('.posts-slider'));
    return card.getBoundingClientRect().width + Number.parseFloat(styles.columnGap || styles.gap || 0);
  };

  const scrollToIndex = (index) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const nextIndex = Math.min(Math.max(index, 0), maxIndex);
    viewport.scrollTo({
      left: Math.min(nextIndex * getScrollStep(), viewport.scrollWidth - viewport.clientWidth),
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const updateVisiblePosts = () => {
      const nextVisiblePosts = getVisiblePosts();
      setVisiblePosts(nextVisiblePosts);
      setCurrentIndex((index) => Math.min(index, Math.max(0, totalPosts - nextVisiblePosts)));
    };

    window.addEventListener('resize', updateVisiblePosts);
    return () => window.removeEventListener('resize', updateVisiblePosts);
  }, [totalPosts]);

  const handleScroll = () => {
    const viewport = viewportRef.current;
    const step = getScrollStep();
    if (!viewport || !step) return;

    setCurrentIndex(Math.min(Math.round(viewport.scrollLeft / step), maxIndex));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToIndex(currentIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <section id="posts" className="posts-section" aria-labelledby="posts-heading">
      <div className="posts-header">
        <div className="posts-title">
          <h2 id="posts-heading">Posts</h2>
          <p>Technical insights and learnings from real projects</p>
        </div>

        <div className="posts-nav" aria-label="Post navigation">
          <span className="posts-counter" aria-live="polite">
            <strong>{currentIndex + 1}–{visibleEnd}</strong>
            <span>of {totalPosts}</span>
          </span>
          <div className="posts-nav-buttons">
            <button
              type="button"
              className="slider-nav"
              onClick={() => scrollToIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Show previous posts"
            >
              <ArrowIcon direction="previous" />
            </button>
            <button
              type="button"
              className="slider-nav"
              onClick={() => scrollToIndex(currentIndex + 1)}
              disabled={currentIndex >= maxIndex}
              aria-label="Show next posts"
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        </div>
      </div>

      <div className="posts-progress" aria-hidden="true">
        <span className="posts-progress-value" style={{ width: `${progress}%` }} />
      </div>

      <div
        className="posts-slider-container"
        ref={viewportRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        data-posts-slider
        role="region"
        aria-label="Posts carousel. Use the arrow keys or navigation buttons to browse."
      >
        <div className="posts-slider">
          {posts.map((post) => (
            <article key={post.id} className="post-slide">
              <Link to={`/posts/${post.slug}`} className="post-card">
                <div className="post-card-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <span className="post-read-more">
                    Read more
                    <span className="post-arrow" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Posts;
