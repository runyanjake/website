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
        console.log('Raw markdown:', text); // Log the raw markdown
        
        const { body } = matter(text);  // Extract just the content after front matter
        console.log('Markdown body:', body); // Log the body after front matter
        
        // Pre-process the markdown to fix image links
        // Look for image syntax like ![alt](url) and fix the URLs
        const processedBody = body.replace(
          /!\[(.*?)\]\((.*?)\)/g,
          (match, alt, url) => {
            console.log('Found image:', { alt, url });
            
            // Make sure the URL is properly formatted
            let fixedUrl = url;
            try {
              // Handle special characters in the URL
              fixedUrl = encodeURI(decodeURIComponent(url));
            } catch (e) {
              console.error('Error processing URL:', e);
            }
            
            return `![${alt}](${fixedUrl})`;
          }
        );
        
        // Configure marked
        marked.setOptions({
          breaks: true,
          gfm: true
        });
        
        const htmlContent = marked(processedBody);
        console.log('HTML content:', htmlContent); // Log the final HTML
        
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

  // Add CSS for images directly in the component
  return (
    <>
      <style>
        {`
          .markdown-content img {
            max-width: 100%;
            height: auto;
            margin: 1em 0;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
