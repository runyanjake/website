import React from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';

export default function FriendCard({ name, website, image, content, fullView = false, linkTo }) {
  // Convert markdown to HTML if content is a string
  const htmlContent = typeof content === 'string' 
    ? marked(content)
    : content;

  return (
    <div className={`friend-card ${fullView ? 'full-view' : ''}`}>
      {/* If linkTo is provided and not in fullView, make the image clickable */}
      {linkTo && !fullView ? (
        <Link to={linkTo} className="friend-image-link">
          <div className="friend-image">
            <img src={image} alt={name} />
          </div>
        </Link>
      ) : (
        <div className="friend-image">
          <img src={image} alt={name} />
        </div>
      )}
      
      <div className="friend-info">
        {/* If linkTo is provided and not in fullView, make the name clickable */}
        {linkTo && !fullView ? (
          <h2>
            <Link to={linkTo}>{name}</Link>
          </h2>
        ) : (
          <h2>{name}</h2>
        )}
        
        <a href={website} target="_blank" rel="noopener noreferrer" className="friend-website">
          {website}
        </a>
        
        <div className="friend-content">
          {typeof htmlContent === 'string' 
            ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            : htmlContent}
        </div>
        
        {/* Add a "Read more" link if not in fullView */}
        {linkTo && !fullView && (
          <Link to={linkTo} className="read-more">
            Read more →
          </Link>
        )}
      </div>
    </div>
  );
} 