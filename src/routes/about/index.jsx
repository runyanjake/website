import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import SectionList from './components/SectionList';
import { useMarkdownContent } from '../../utils/contentLoader';
import './about.css';

const ABOUT_CONTENT_PATH = '/content/about';

export default function About() {
  const { posts: sections, isLoading, error } = useMarkdownContent(ABOUT_CONTENT_PATH);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="about-container">
          <p>Loading about sections...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="about-container">
          <p>Error loading about sections: {error.message}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="about-container">
        <h1>About</h1>
        {sections && sections.length > 0 ? (
          <SectionList sections={sections} />
        ) : (
          <div className="about-error">
            <p>No about sections found.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 