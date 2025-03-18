import React from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../../../components/ContentRenderer/MarkdownRenderer';

export default function FriendCard({ title, website, image, slug, path, fullView = false }) {

  return fullView ? (
    <div className="friend-card full-view">
      <img src={image} alt={title} />
      <h1>{title}</h1>
      <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
      <div className="friend-content">
        <MarkdownRenderer contentPath={path} />
      </div>
    </div>
  ) : (
    <div className="friend-card">
      <Link to={`/friends/${slug}`}>
        <img src={image} alt={title} />
        <h2>{title}</h2>
      </Link>
      <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
    </div>
  );
} 