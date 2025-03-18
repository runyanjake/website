import React, { useState, useEffect } from 'react';
import { useMarkdownContent } from '../../utils/contentLoader';
import { marked } from 'marked';
import { loadMarkdownFile } from '../../utils/contentLoader';

// Configure marked to customize rendering
marked.use({
  renderer: {
    // Override the hr (horizontal rule) renderer to return empty string
    hr() {
      return '';
    }
  }
});

export default function MarkdownRenderer({ 
  contentPath,
  contentType = 'default',
  fallback = null,
  postId = null,
  blogDirectory = null,
  renderPost = null,
  renderComponent = null
}) {
  const [content, setContent] = useState(null);
  const [frontMatter, setFrontMatter] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // If we're rendering a blog post and have a postId and directory
  if (postId && blogDirectory && renderPost) {
    // Use the useMarkdownContent hook to load posts
    const { posts, isLoading: postsLoading, error: postsError } = useMarkdownContent(blogDirectory);
    
    // Find the current post
    const currentPost = posts.find(post => post.id === postId || post.slug === postId);
    
    if (postsLoading) return <div>Loading content...</div>;
    
    if (postsError || !currentPost) {
      console.error("Error loading post:", postsError);
      return fallback || <div>Error loading content: {postsError?.message || "Post not found"}</div>;
    }
    
    // Render the post using the provided render function
    return renderPost({
      ...currentPost,
      // The content is already in markdown format, BlogPost will handle conversion
      content: currentPost.content
    });
  }
  
  // Load content from path
  useEffect(() => {
    async function loadContent() {
      if (!contentPath) {
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await loadMarkdownFile(contentPath, contentType);
        setContent(data.content);
        
        // Remove content from the data object to get just front matter
        const { content: _, ...frontMatterData } = data;
        setFrontMatter(frontMatterData);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [contentPath, contentType]);

  if (isLoading) return <div>Loading content...</div>;
  if (error) {
    console.error("Error loading markdown:", error);
    return fallback || <div>Error loading content: {error.message}</div>;
  }

  if (!content) {
    return fallback || <div>Loading...</div>;
  }

  // If a render component is provided, use it
  if (renderComponent) {
    // Make sure we're passing the HTML content, not the raw markdown
    return renderComponent(content);
  }

  // Otherwise, render the content directly
  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}

// Add a way to access front matter if needed
MarkdownRenderer.getFrontMatter = () => frontMatter; 