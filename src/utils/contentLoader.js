import matter from 'front-matter';
import { useEffect, useState } from 'react';

export function useMarkdownContent(contentDirectory) {
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
            return await loadMarkdownFile(filePath);
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
  }, [contentDirectory]);

  return { posts, isLoading, error };
}

export async function loadMarkdownFile(filePath) {
  try {
    const response = await fetch(filePath, {
      headers: {
        'Accept': 'text/markdown,text/plain'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch:', filePath, 'Status:', response.status);
      throw new Error(`Failed to load markdown file: ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Use front-matter to parse the content, don't need the body as we'll look it up later.
    const { attributes } = matter(text);

    // Create slug from name
    const slug = attributes.title
      ? attributes.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : filePath.split('/').pop().replace('.md', '');

    return {
      ...attributes, // Spread all front matter attributes directly
      path: filePath,
      slug: slug
    };
  } catch (error) {
    console.error('Error loading markdown file:', error);
    throw error;
  }
}
