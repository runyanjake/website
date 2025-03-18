import React, { useState } from 'react';
import MarkdownRenderer from '../../../components/ContentRenderer/MarkdownRenderer';

export default function AboutSection({ title, path }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="about-section">
      <div 
        className="section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
      >
        <h2>{title}</h2>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      {isExpanded && (
        <div className="section-content">
          <MarkdownRenderer contentPath={path} />
        </div>
      )}
    </div>
  );
} 