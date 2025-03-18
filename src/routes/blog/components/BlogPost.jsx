import React from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../../../components/ContentRenderer/MarkdownRenderer';

export default function BlogPost({ title, date, author, path, slug, fullView = false }) {
  console.log('BlogPost', title, date, author, path, slug, fullView);

  // Format the date string
  const formattedDate = date instanceof Date 
    ? date.toLocaleDateString()
    : new Date(date).toLocaleDateString();

  return fullView ? (
    <div className="blog-post full-view">
      <h1>{title}</h1>
      <div className="post-meta">
        <span>{formattedDate}</span>
        {author && <span> • {author}</span>}
      </div>
      <div className="post-content">
        <MarkdownRenderer contentPath={path} />
      </div>
    </div>
  ) : (
    <div className="blog-post preview">
      <Link to={`/blog/${slug}`}>
        <h2>{title}</h2>
      </Link>
      <div className="post-meta">
        <span>{formattedDate}</span>
        {author && <span> • {author}</span>}
      </div>
    </div>
  );
} 