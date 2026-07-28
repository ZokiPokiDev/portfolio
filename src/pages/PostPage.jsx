import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, getPosts } from '../base/posts';
import Seo from '../components/Seo';
import './PostPage.css';

const allPostsTarget = { pathname: '/', hash: '#posts' };

const isUnorderedListItem = (line) => /^\s*[-*+]\s+/.test(line);
const isOrderedListItem = (line) => /^\s*\d+[.)]\s+/.test(line);
const isBlockStarter = (line) => (
  /^```/.test(line)
  || /^#{1,6}\s+/.test(line)
  || /^\s*(?:[-*+]\s+|\d+[.)]\s+)/.test(line)
  || /^\s*(?:---+|\*\*\*+)\s*$/.test(line)
  || /^>\s?/.test(line)
);

const renderInlineMarkdown = (text) => {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_)/g);

  return tokens.filter(Boolean).map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)$/);
    if (link) {
      const [, label, href] = link;
      const safeHref = /^(?:https?:|mailto:|\/|#)/i.test(href);
      return safeHref ? <a key={index} href={href}>{label}</a> : label;
    }

    if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }

    return token;
  });
};

const MarkdownContent = ({ content }) => {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];

    if (!line.trim()) {
      lineIndex += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const language = line.slice(3).trim();
      const codeLines = [];
      lineIndex += 1;

      while (lineIndex < lines.length && !/^```/.test(lines[lineIndex])) {
        codeLines.push(lines[lineIndex]);
        lineIndex += 1;
      }

      if (lineIndex < lines.length) lineIndex += 1;
      blocks.push(
        <pre key={`code-${lineIndex}`} data-language={language || undefined}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const [, markers, text] = heading;
      const Heading = `h${markers.length}`;
      blocks.push(<Heading key={`heading-${lineIndex}`}>{renderInlineMarkdown(text)}</Heading>);
      lineIndex += 1;
      continue;
    }

    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
      blocks.push(<hr key={`rule-${lineIndex}`} />);
      lineIndex += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (lineIndex < lines.length && /^>\s?/.test(lines[lineIndex])) {
        quoteLines.push(lines[lineIndex].replace(/^>\s?/, ''));
        lineIndex += 1;
      }
      blocks.push(<blockquote key={`quote-${lineIndex}`}>{renderInlineMarkdown(quoteLines.join(' '))}</blockquote>);
      continue;
    }

    if (isUnorderedListItem(line) || isOrderedListItem(line)) {
      const ordered = isOrderedListItem(line);
      const items = [];

      while (lineIndex < lines.length && (ordered ? isOrderedListItem(lines[lineIndex]) : isUnorderedListItem(lines[lineIndex]))) {
        items.push(lines[lineIndex].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/, ''));
        lineIndex += 1;
      }

      const List = ordered ? 'ol' : 'ul';
      blocks.push(
        <List key={`list-${lineIndex}`}>
          {items.map((item, itemIndex) => <li key={itemIndex}>{renderInlineMarkdown(item)}</li>)}
        </List>
      );
      continue;
    }

    const paragraph = [line.trim()];
    lineIndex += 1;
    while (lineIndex < lines.length && lines[lineIndex].trim() && !isBlockStarter(lines[lineIndex])) {
      paragraph.push(lines[lineIndex].trim());
      lineIndex += 1;
    }
    blocks.push(<p key={`paragraph-${lineIndex}`}>{renderInlineMarkdown(paragraph.join(' '))}</p>);
  }

  return <>{blocks}</>;
};

const PostPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const allPosts = getPosts();

  if (!post) {
    return (
      <div className="box-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Post not found</h2>
        <p>This post doesn't exist or has been removed.</p>
        <Link to={allPostsTarget} className="text-link">← All Posts</Link>
      </div>
    );
  }

  // Find related posts (same tags)
  const relatedPosts = allPosts.filter(p => 
    p.slug !== post.slug && 
    p.tags.some(tag => post.tags.includes(tag))
  ).slice(0, 3);

  return (
    <div className="post-page">
      <Seo 
        title={post.title}
        description={post.excerpt}
        url={`https://yourdomain.com/posts/${post.slug}`}
      />
      
      <article className="box-card">
        <header style={{ marginBottom: '1.5rem' }}>
          <Link to={allPostsTarget} className="text-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            ← All Posts
          </Link>
          <h1 style={{ margin: '0.5rem 0', color: 'var(--primary)' }}>{post.title}</h1>
          <p style={{ margin: 0, color: 'var(--muted-text)', fontSize: '1.08rem' }}>{post.excerpt}</p>
        </header>

        <div className="post-content">
          <MarkdownContent content={post.content} />
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

        <footer style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--default-border)' }}>
          <Link to={allPostsTarget} className="text-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            ← All Posts
          </Link>
        </footer>
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
    </div>
  );
};

export default PostPage;
