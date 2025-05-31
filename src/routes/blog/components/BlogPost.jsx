import React from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../../../components/ContentRenderer/MarkdownRenderer';

export default function BlogPost({ title, date, author, path, slug, fullView = false }) {

  // Format the date string
  const formattedDate = date instanceof Date 
    ? date.toLocaleDateString()
    : new Date(date).toLocaleDateString();

  if (fullView) {
    return (
      <article className="blog-post full-view card">
        <header className="blog-post-header">
          <h1 className="blog-post-title">{title}</h1>
          <div className="post-meta">
            <span>{formattedDate}</span>
            {author && <span> • {author}</span>}
          </div>
        </header>
        <div className="post-content">
          <MarkdownRenderer contentPath={path} />
        </div>
      </article>
    );
  }

  return (
    <article className="blog-post preview card">
      <header className="blog-post-header">
        <Link to={`/blog/${slug}`} className="blog-post-link">
          <h2 className="blog-post-title">{title}</h2>
        </Link>
        <div className="post-meta">
          <span>{formattedDate}</span>
          {author && <span> • {author}</span>}
        </div>
      </header>
      <footer className="blog-post-footer">
        <Link to={`/blog/${slug}`} className="read-more-cta">Read More →</Link>
      </footer>
    </article>
  );
} 