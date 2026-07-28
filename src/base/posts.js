const markdownFiles = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const requiredFields = ['id', 'title', 'excerpt', 'slug', 'tags', 'order'];

const parsePost = (source, path) => {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Post ${path} must start with YAML-style front matter.`);
  }

  const [, frontMatter, content] = match;
  const fields = Object.fromEntries(
    frontMatter
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(':');
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      })
  );

  const missingFields = requiredFields.filter((field) => !fields[field]);
  if (missingFields.length) {
    throw new Error(`Post ${path} is missing: ${missingFields.join(', ')}.`);
  }

  return {
    id: fields.id,
    title: fields.title,
    excerpt: fields.excerpt,
    slug: fields.slug,
    tags: fields.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    order: Number(fields.order),
    content: content.trim(),
  };
};

export const posts = Object.entries(markdownFiles)
  .map(([path, source]) => parsePost(source, path))
  .sort((firstPost, secondPost) => firstPost.order - secondPost.order);

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function getPosts() {
  return posts;
}
