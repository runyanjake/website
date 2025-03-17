import React from 'react';
import { marked } from 'marked';

export default function BlogPost({ title, date, author, content }) {
  // Convert markdown to HTML if content is a string
  const htmlContent = typeof content === 'string' 
    ? marked(content)
    : content;

  return (
    <article className="blog-post">
      <header>
        <h1>{title}</h1>
        <div className="post-meta">
          <span className="post-date">
            {typeof date === 'object' && date instanceof Date 
              ? date.toLocaleDateString() 
              : date}
          </span>
          {author && <span className="post-author"> by {author}</span>}
        </div>
      </header>
      <div className="post-content">
        {typeof htmlContent === 'string' 
          ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          : htmlContent}
      </div>
    </article>
  );
} 