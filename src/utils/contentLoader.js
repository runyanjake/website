import yaml from 'js-yaml';
import { useEffect, useState } from 'react';

// Define metadata extractors for different content types
const metadataExtractors = {
  friends: (data, path) => ({
    path,
    name: data.name || 'Unknown',
    website: data.website || '',
    image: data.image || '/default-avatar.png'
  }),
  blog: (data, path) => ({
    path,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    author: data.author || 'Anonymous',
    excerpt: data.excerpt || '',
    slug: data.slug || path.split('/').pop().replace('.md', '')
  }),
  about: (data, path) => ({
    path,
    title: data.title || 'Untitled',
    order: data.order || 0
  }),
  default: (data, path) => ({
    path,
    content: data.content || ''
  })
};

export function useYamlContent(path) {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.status}`);
        }
        const text = await response.text();
        const data = yaml.load(text);
        setContent(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [path]);

  return { content, isLoading, error };
}

export async function loadMarkdownFile(filePath, contentType = 'default') {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${response.statusText}`);
    }
    const text = await response.text();
    
    // Extract front matter using regex
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = text.match(frontMatterRegex);
    
    let frontMatter = {};
    let content = text;
    
    if (match) {
      try {
        frontMatter = yaml.load(match[1]);
        content = text.replace(frontMatterRegex, '').trim();
      } catch (yamlError) {
        console.error('Error parsing front matter:', yamlError);
      }
    }

    // Extract metadata based on content type
    const extractMetadata = metadataExtractors[contentType] || metadataExtractors.default;
    const metadata = extractMetadata(frontMatter, filePath);

    return {
      ...metadata,
      content
    };
  } catch (error) {
    console.error('Error loading markdown file:', error);
    throw error;
  }
}

export function useMarkdownContent(contentDirectory, contentType = 'default') {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError(null);

        const indexResponse = await fetch(`${contentDirectory}/index.json`);
        if (!indexResponse.ok) {
          throw new Error('Failed to load content index');
        }
        const { files } = await indexResponse.json();

        const loadedPosts = await Promise.all(
          files.map(async (filename) => {
            const filePath = `${contentDirectory}/posts/${filename}`;
            return await loadMarkdownFile(filePath, contentType);
          })
        );

        setPosts(loadedPosts);
      } catch (err) {
        setError(err);
        console.error('Error loading content:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [contentDirectory, contentType]);

  return { posts, isLoading, error };
} 
