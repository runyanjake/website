import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import MarkdownRenderer from '../../components/ContentRenderer/MarkdownRenderer';
import './home.css';

export default function Home() {
  return (
    <MainLayout>
      <div className="home-container">
        <MarkdownRenderer
          contentPath="/content/home/index.md"
          fallback={
            <div className="home-fallback">
              <h1>Welcome to My Website</h1>
              <p>This is my personal website where I share my thoughts and projects.</p>
              <p>Navigate to different sections using the links above.</p>
            </div>
          }
        />
      </div>
    </MainLayout>
  );
} 