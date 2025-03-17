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
        console.log(`Loading posts from directory: ${blogDirectory}`);
        
        // Read index.json to find posts to display.
        const directoryResponse = await fetch(`${blogDirectory}/index.json`);
        if (!directoryResponse.ok) {
          throw new Error(`Failed to load index: ${directoryResponse.status}`);
        }
        
        const directoryData = await directoryResponse.json();
        console.log('Index data:', directoryData);
        
        // Check for either files or sectionFiles property
        const fileList = directoryData.sectionFiles || directoryData.files;
        
        if (!fileList || !Array.isArray(fileList)) {
          throw new Error('Invalid index format: missing files or sectionFiles array');
        }
        
        // Determine the correct directory for the files
        let postsDirectory;
        if (blogDirectory.endsWith('/sections')) {
          // If we're in a sections directory, use it directly
          postsDirectory = blogDirectory;
        } else if (directoryData.sectionFiles) {
          // If the index.json has a sectionFiles property, use the sections subdirectory
          postsDirectory = `${blogDirectory}/sections`;
        } else {
          // Default to the posts subdirectory
          postsDirectory = `${blogDirectory}/posts`;
        }
        console.log('Posts directory:', postsDirectory);
        
        const loadedPosts = await Promise.all(
          fileList.map(async (filename) => {
            try {
              // Generate a unique ID from the filename
              const id = filename.replace(/\.[^/.]+$/, ""); // Remove file extension
              
              console.log(`Loading post: ${filename}, ID: ${id}`);
              
              const response = await fetch(`${postsDirectory}/${filename}`);
              if (!response.ok) {
                console.error(`Failed to load post ${filename}: ${response.status}`);
                return null;
              }
              
              const text = await response.text();
              
              // Extract front matter (metadata) from markdown
              const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
              const match = text.match(frontMatterRegex);
              
              if (!match) {
                console.warn(`No front matter found in post ${filename}`);
                return {
                  id,
                  title: `Untitled Post ${id}`,
                  date: new Date().toISOString().split('T')[0],
                  excerpt: 'No excerpt available',
                  content: text,
                  slug: id, // Use the ID as the slug for URLs
                  filename
                };
              }
              
              try {
                const frontMatter = yaml.load(match[1]);
                console.log(`Front matter for ${filename}:`, frontMatter);
                
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
                  content,
                  slug,
                  filename,
                  order: frontMatter.order
                };
              } catch (yamlError) {
                console.error(`Error parsing front matter for post ${filename}:`, yamlError);
                return {
                  id,
                  title: `Error in ${filename}`,
                  date: new Date().toISOString().split('T')[0],
                  excerpt: 'Error parsing post metadata',
                  content: text,
                  slug: id,
                  filename
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
        
        // Sort posts by date (newest first) or by order if available
        filteredPosts.sort((a, b) => {
          // If both posts have an order property, sort by order
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          // Otherwise sort by date
          return new Date(b.date || 0) - new Date(a.date || 0);
        });
        
        console.log(`Successfully loaded ${filteredPosts.length} posts`);
        setPosts(filteredPosts);
      } catch (err) {
        console.error("Error loading posts:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [blogDirectory]);

  return { posts, isLoading, error };
} 