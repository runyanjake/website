import React from 'react';
import BlogPost from './BlogPost';

export default function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <BlogPost
          key={post.slug}
          title={post.title}
          date={post.date}
          author={post.author}
          path={post.path}
          slug={post.slug}
          fullView={true}
        />
      ))}
    </div>
  );
} 