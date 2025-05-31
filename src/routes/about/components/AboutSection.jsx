import React from 'react';
import MarkdownRenderer from '../../../components/ContentRenderer/MarkdownRenderer';

export default function AboutSection({ title, path }) {
  return (
    <article className="about-post">
      <header className="about-post-header">
        <h2 className="about-post-title">{title}</h2>
      </header>
      <div className="about-post-content">
        <MarkdownRenderer contentPath={path} />
      </div>
    </article>
  );
} 