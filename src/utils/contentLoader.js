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


        const indexPath = `${contentDirectory}/index.json`;

        const indexResponse = await fetch(indexPath);
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
      throw new Error(`Failed to load markdown file ${filePath}: ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Use front-matter to parse the content
    const { attributes } = matter(text);

    // Get filename without extension
    const filename = filePath.split('/').pop().replace('.md', '');
    
    // Create slug based on filename pattern
    let slug;
    if (filename.match(/^\d{4}-\d{2}-\d{2}-/)) {
      // For blog posts: remove date prefix and convert to slug
      slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    } else {
      // For other content: use title or filename
      slug = attributes.title
        ? attributes.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : filename;
    }
    
    // This usually becomes relevant when we add a new section.
    //console.log('Metadata from Markdown File:', 'slug', slug, 'filename', filename, 'attributes', attributes);

    return {
      ...attributes,
      path: filePath,
      slug: slug
    };
  } catch (error) {
    console.error('Error loading markdown file:', error);
    throw error;
  }
}
