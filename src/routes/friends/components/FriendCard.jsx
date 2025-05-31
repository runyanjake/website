import React from 'react';
import MarkdownRenderer from '../../../components/ContentRenderer/MarkdownRenderer';

export default function FriendCard({ title, website, image, path }) {
  return (
    <div className="friend-card">
      <img src={image} alt={title} />
      <h2>{title}</h2>
      <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
      <div className="friend-content">
        <MarkdownRenderer contentPath={path} />
      </div>
    </div>
  );
} 