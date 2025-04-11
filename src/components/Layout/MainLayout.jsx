import React from 'react';
import { Link } from 'react-router-dom';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header>
        <nav>
          <ul>
            <li><Link to="/">jake</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/friends">Friends</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>
      
      <main className="page-container">
        {children}
      </main>
      
      <footer>
        <p>© {new Date().getFullYear()} Jake Runyan</p>
      </footer>
    </div>
  );
} 