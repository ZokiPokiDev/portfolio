import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, getPosts } from '../base/posts';
import Seo from '../components/Seo';

const PostPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const allPosts = getPosts();

  if (!post) {
    return (
      <div className="box-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Post not found</h2>
        <p>This post doesn't exist or has been removed.</p>
        <Link to="/#posts" className="text-link">← Back to all posts</Link>
      </div>
    );
  }

  // Find related posts (same tags)
  const relatedPosts = allPosts.filter(p => 
    p.slug !== post.slug && 
    p.tags.some(tag => post.tags.includes(tag))
  ).slice(0, 3);

  // Parse content into sections for better styling
  const renderContent = (content) => {
    // This simple parser handles markdown-like formatting
    const lines = content.split('\n');
    
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h3 key={idx} style={{ color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{line.substring(3)}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>{line.substring(2)}</h2>;
      }
      
      // Bold
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return <p key={idx} style={{ margin: '0.75rem 0', color: 'var(--text)', lineHeight: '1.6' }}>
          {parts.map((part, partIdx) => 
            partIdx % 2 === 1 ? <strong key={partIdx}>{part}</strong> : part
          )}
        </p>;
      }
      
      // Code blocks
      if (line.startsWith('```')) {
        // Find closing ```
        let endIdx = idx + 1;
        while (endIdx < lines.length && !lines[endIdx].startsWith('```')) {
          endIdx++;
        }
        const codeContent = lines.slice(idx + 1, endIdx).join('\n');
        
        // Skip the closing ``` line
        const skipLines = endIdx - idx + 1;
        
        return (
          <div key={idx} style={{ margin: '1rem 0', overflowX: 'auto' }}>
            <pre style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '8px',
              padding: '1rem',
              margin: 0,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: '0.88rem',
              lineHeight: '1.5',
              boxShadow: 'var(--shadow)'
            }}>
              <code>{codeContent}</code>
            </pre>
            {/* Skip the next lines we have already processed */}
            {Array.from({ length: skipLines - 1 }).map((_, skipIdx) => <span key={idx + skipIdx + 1}></span>)}
          </div>
        );
      }
      
      // List items
      if (line.startsWith('- [ ]') || line.startsWith('- [x]') || line.trim().startsWith('- ')) {
        const checkbox = line.startsWith('- [x]') ? '✓' : line.startsWith('- [ ]') ? '⬜' : '•';
        const text = line.replace(/^- \[.*?\] /, '').replace(/^- /, '');
        return <li key={idx} style={{ margin: '0.35rem 0', color: 'var(--text)', lineHeight: '1.6' }}>
          <span style={{ marginRight: '0.5rem' }}>{checkbox}</span>
          {text}
        </li>;
      }
      
      // Regular paragraph
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '0.75rem' }}></div>;
      }
      
      return <p key={idx} style={{ margin: '0.75rem 0', color: 'var(--text)', lineHeight: '1.6' }}>{line}</p>;
    }).filter(el => el !== null);
  };

  return (
    <div className="post-page">
      <Seo 
        title={post.title}
        description={post.excerpt}
        url={`https://yourdomain.com/posts/${post.slug}`}
      />
      
      <article className="box-card">
        <header style={{ marginBottom: '1.5rem' }}>
          <Link to="/#posts" className="text-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            ← All Posts
          </Link>
          <h1 style={{ margin: '0.5rem 0', color: 'var(--primary)' }}>{post.title}</h1>
          <p style={{ margin: 0, color: 'var(--muted-text)', fontSize: '1.08rem' }}>{post.excerpt}</p>
        </header>

        <div className="post-content">
          {renderContent(post.content)}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--default-border)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  style={{
                    padding: '0.22rem 0.55rem',
                    borderRadius: '6px',
                    background: 'rgba(31, 111, 235, 0.12)',
                    color: 'var(--primary)',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    border: '1px solid rgba(31, 111, 235, 0.2)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Related Posts</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {relatedPosts.map(related => (
              <Link 
                key={related.slug} 
                to={`/posts/${related.slug}`}
                className="post-card"
                style={{ height: '100%' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.2rem', height: '100%' }}>
                  <h4 style={{ margin: 0, color: 'var(--text)', fontWeight: 800, lineHeight: 1.3 }}>{related.title}</h4>
                  <p style={{ margin: 0, color: 'var(--muted-text)', fontSize: '0.9rem', lineHeight: 1.45, flex: 1 }}>
                    {related.excerpt}
                  </p>
                  <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/#posts" className="text-link">← Back to all posts</Link>
      </div>
    </div>
  );
};

export default PostPage;
