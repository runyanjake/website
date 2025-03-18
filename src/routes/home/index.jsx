import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import MarkdownRenderer from '../../components/ContentRenderer/MarkdownRenderer';
import './home.css';

const HOME_CONTENT_PATH = '/content/home';

export default function Home() {
  return (
    <MainLayout>
      <div className="home-container">
        <MarkdownRenderer 
          contentPath={`${HOME_CONTENT_PATH}/index.md`}
          contentType="default"
          fallback={<p>Welcome to my website!</p>}
        />
      </div>
    </MainLayout>
  );
} 