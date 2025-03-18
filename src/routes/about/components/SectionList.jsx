import React from 'react';
import AboutSection from './AboutSection';

export default function SectionList({ sections }) {
  if (!sections || sections.length === 0) {
    return <p>No sections available.</p>;
  }

  // Sort sections by order if available
  const sortedSections = [...sections].sort((a, b) => 
    (a.order || 0) - (b.order || 0)
  );

  return (
    <div className="sections-list">
      {sortedSections.map(section => (
        <AboutSection
          key={section.slug}
          title={section.title}
          path={section.path}
        />
      ))}
    </div>
  );
} 