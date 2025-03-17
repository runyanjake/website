import React from 'react';
import { useYamlContent } from '../../utils/contentLoader';

export default function YamlRenderer({ contentPath, renderComponent, fallback = null }) {
  const { content, isLoading, error } = useYamlContent(contentPath);

  if (isLoading) return <div>Loading content...</div>;
  if (error) {
    console.error("Error loading YAML:", error);
    return fallback || <div>Error loading content: {error.message}</div>;
  }

  return renderComponent(content);
} 