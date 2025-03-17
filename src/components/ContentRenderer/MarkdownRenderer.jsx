import React, { useState, useEffect } from 'react';
import { useMarkdownContent } from '../../utils/contentLoader';
import { marked } from 'marked';

export default function MarkdownRenderer({ 
  contentPath,
  fallback = null,
  postId = null,
  blogDirectory = null,
  renderPost = null,
  renderComponent = null
}) {
  const [content, setContent] = useState(null);
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
        const response = await fetch(contentPath);
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.status}`);
        }
        const text = await response.text();
        const html = marked(text);
        setContent(html);
      } catch (err) {
        console.error("Error loading markdown:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [contentPath]);

  if (isLoading) return <div>Loading content...</div>;
  if (error) {
    console.error("Error loading markdown:", error);
    return fallback || <div>Error loading content: {error.message}</div>;
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