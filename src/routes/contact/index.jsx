import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';

export default function Contact() {
  return (
    <MainLayout>
      <div className="contact-page">
        <h1>Contact Us</h1>
        <p>This is the contact page. You can add your content here.</p>
        
        <form>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="5"></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </MainLayout>
  );
} 