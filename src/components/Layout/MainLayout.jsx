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
        
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Jake Runyan</p>
        </footer>
      </main>
    </div>
  );
} 