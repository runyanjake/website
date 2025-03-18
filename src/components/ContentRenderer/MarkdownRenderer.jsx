import React, { useState, useEffect } from 'react';
import matter from 'front-matter';
import { marked } from 'marked';

export default function MarkdownRenderer({ contentPath }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(contentPath);
        if (!response.ok) {
          throw new Error(`Failed to load markdown: ${response.statusText}`);
        }
        
        const text = await response.text();
        const { body } = matter(text);  // Extract just the content after front matter
        const htmlContent = marked(body); // Convert markdown to HTML
        
        setContent(htmlContent);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err);
      }
    }

    if (contentPath) {
      loadContent();
    }
  }, [contentPath]);

  if (error) {
    return <div className="markdown-error">Error loading content: {error.message}</div>;
  }

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
