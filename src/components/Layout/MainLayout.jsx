import React from 'react';
import { Link } from 'react-router-dom';
import './MainLayout.css';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header className="site-header">
        <div className="container">
          <nav>
            <ul>
              <li><Link to="/">jake</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/friends">Friends</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="site-main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Jake Runyan</p>
        </div>
      </footer>
    </div>
  );
} 