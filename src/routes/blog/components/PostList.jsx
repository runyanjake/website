import React from 'react';
import { Link } from 'react-router-dom';

export default function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.path} className="post-preview">
          <h2>
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <div className="post-meta">
            <span>{post.date}</span>
            {post.author && <span> • {post.author}</span>}
          </div>
          <Link to={`/blog/${post.slug}`} className="read-more">
            Read more
          </Link>
        </div>
      ))}
    </div>
  );
} 