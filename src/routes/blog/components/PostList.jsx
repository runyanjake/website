import React from 'react';
import { Link } from 'react-router-dom';

export default function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className="post-item">
          <h2>
            <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
          </h2>
          <div className="post-meta">
            <span className="post-date">
              {typeof post.date === 'object' && post.date instanceof Date 
                ? post.date.toLocaleDateString() 
                : post.date}
            </span>
            {post.author && <span className="post-author"> by {post.author}</span>}
          </div>
          <p className="post-excerpt">{post.excerpt}</p>
          <Link to={`/blog/${post.slug || post.id}`} className="read-more">
            Read more →
          </Link>
        </div>
      ))}
    </div>
  );
} 