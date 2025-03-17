import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import './not-found.css';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="not-found-container">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <div className="not-found-links">
          <Link to="/" className="home-link">Go to Home</Link>
          <Link to="/blog" className="blog-link">Check out the Blog</Link>
          <Link to="/friends" className="friends-link">Meet my Friends</Link>
        </div>
      </div>
    </MainLayout>
  );
} 