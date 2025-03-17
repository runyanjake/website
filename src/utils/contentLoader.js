import yaml from 'js-yaml';
import { useEffect, useState } from 'react';

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

export function useMarkdownContent(blogDirectory) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        console.log(`Loading posts from blog directory: ${blogDirectory}`);
        
        // Read index.json to find blog posts to display.
        const directoryResponse = await fetch(`${blogDirectory}/index.json`);
        if (!directoryResponse.ok) {
          throw new Error(`Failed to load blog index: ${directoryResponse.status}`);
        }
        
        const directoryData = await directoryResponse.json();
        
        if (!directoryData.files || !Array.isArray(directoryData.files)) {
          throw new Error('Invalid blog index format');
        }
        
        const postsDirectory = `${blogDirectory}/posts`;
        
        const loadedPosts = await Promise.all(
          directoryData.files.map(async (filename, index) => {
            try {
              // Generate a stable ID from the index or filename
              // This ID is just for internal reference and doesn't affect the URL
              const id = `post-${index + 1}`;
              const url = `${postsDirectory}/${filename}`;
              
              const response = await fetch(url);
              
              if (!response.ok) {
                console.warn(`Failed to load post ${id}: ${response.status}`);
                return null;
              }
              
              const text = await response.text();
              
              // Extract front matter (metadata) from markdown
              const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
              const match = text.match(frontMatterRegex);
              
              if (!match) {
                console.warn(`No front matter found in post ${id}`);
                return {
                  id,
                  title: `Untitled Post ${id}`,
                  date: new Date().toISOString().split('T')[0],
                  excerpt: 'No excerpt available',
                  content: text,
                  slug: id // Use the ID as the slug for URLs
                };
              }
              
              try {
                const frontMatter = yaml.load(match[1]);
                const content = text.replace(frontMatterRegex, '').trim();
                
                // Format the date as a string if it's a Date object
                const dateValue = frontMatter.date;
                const formattedDate = dateValue instanceof Date 
                  ? dateValue.toISOString().split('T')[0] // Format as YYYY-MM-DD
                  : dateValue;
                
                // Generate a slug from the title or name if not provided
                const titleOrName = frontMatter.title || frontMatter.name;
                const slug = frontMatter.slug || 
                  (titleOrName ? titleOrName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
                
                return {
                  id,
                  title: frontMatter.title,
                  name: frontMatter.name,
                  date: formattedDate,
                  author: frontMatter.author,
                  website: frontMatter.website,
                  image: frontMatter.image,
                  excerpt: frontMatter.excerpt || content.substring(0, 150) + '...',
                  content, // This should be just the markdown content, not including any file paths
                  slug,
                  filename
                };
              } catch (yamlError) {
                console.error(`Error parsing front matter for post ${id}:`, yamlError);
                return {
                  id,
                  title: `Error in Post ${id}`,
                  date: new Date().toISOString().split('T')[0],
                  excerpt: 'Error parsing post metadata',
                  content: text,
                  slug: id
                };
              }
            } catch (fetchError) {
              console.error(`Error fetching post ${filename}:`, fetchError);
              return null;
            }
          })
        );
        
        // Filter out any null posts (failed to load)
        const filteredPosts = loadedPosts.filter(post => post !== null);
        
        // Sort posts by date (newest first)
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log(`Successfully loaded ${filteredPosts.length} posts`);
        setPosts(filteredPosts);
      } catch (err) {
        console.error("Error loading blog posts:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [blogDirectory]);

  return { posts, isLoading, error };
} 