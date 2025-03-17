import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';

// Import route components
import Home from './routes/home';
import About from './routes/about';
import Blog from './routes/blog';
import Friends from './routes/friends';
import Contact from './routes/contact';
import NotFound from './routes/not-found';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/:sectionId" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<Blog />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friends/:friendId" element={<Friends />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
