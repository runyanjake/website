import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import MarkdownRenderer from '../../components/ContentRenderer/MarkdownRenderer';
import { useMarkdownContent } from '../../utils/contentLoader';
import './about.css';

const ABOUT_CONTENT_PATH = '/content/about';
const SECTIONS_DIRECTORY = `${ABOUT_CONTENT_PATH}/sections`;

export default function About() {
  const { sectionId } = useParams();
  const { posts: sections, isLoading, error } = useMarkdownContent(SECTIONS_DIRECTORY, 'about');
  const [activeSection, setActiveSection] = useState(sectionId || null);
  
  // Update activeSection when sectionId changes
  useEffect(() => {
    setActiveSection(sectionId || null);
  }, [sectionId]);
  
  // Debug logging
  console.log('About component state:', {
    sections,
    isLoading,
    error,
    sectionId,
    activeSection,
    aboutContentPath: ABOUT_CONTENT_PATH,
    sectionsDirectory: SECTIONS_DIRECTORY
  });
  
  // Fetch and log the index.json file directly to debug
  useEffect(() => {
    async function fetchIndexJson() {
      try {
        const response = await fetch(`${ABOUT_CONTENT_PATH}/index.json`);
        if (!response.ok) {
          console.error(`Failed to load sections index: ${response.status}`);
          return;
        }
        const data = await response.json();
        console.log('About index.json:', data);
      } catch (err) {
        console.error('Error fetching about index:', err);
      }
    }
    
    fetchIndexJson();
  }, []);
  
  // Sort sections by order if available
  const sortedSections = sections && sections.length > 0 
    ? [...sections].sort((a, b) => {
        const orderA = a.order || 999;
        const orderB = b.order || 999;
        return orderA - orderB;
      })
    : [];

  return (
    <MainLayout>
      <div className="about-container">
        <div className="about-header">
          <MarkdownRenderer
            contentPath={`${ABOUT_CONTENT_PATH}/index.md`}
            fallback={<h1>About Me</h1>}
          />
        </div>
        
        {isLoading ? (
          <p>Loading about information...</p>
        ) : error ? (
          <p>Error loading about information: {error.message}</p>
        ) : (
          <div className="about-content">
            {sortedSections.length > 0 ? (
              <>
                <div className="about-nav">
                  {sortedSections.map(section => (
                    <button
                      key={section.id}
                      className={`about-nav-item ${activeSection === (section.slug || section.id) ? 'active' : ''}`}
                      onClick={() => setActiveSection(section.slug || section.id)}
                    >
                      {section.title || section.id}
                    </button>
                  ))}
                </div>
                
                <div className="about-section">
                  {activeSection ? (
                    // Display the selected section
                    sortedSections.find(s => (s.slug || s.id) === activeSection) ? (
                      <div className="about-section-content">
                        <MarkdownRenderer
                          contentPath={`${SECTIONS_DIRECTORY}/${
                            sortedSections.find(s => (s.slug || s.id) === activeSection).filename
                          }`}
                          fallback={<p>Section content not found.</p>}
                        />
                      </div>
                    ) : (
                      <p>Section not found.</p>
                    )
                  ) : (
                    // If no section is selected, display all sections
                    <div className="about-all-sections">
                      {sortedSections.map(section => (
                        <div key={section.id} className="about-section-content" id={section.slug || section.id}>
                          <h2>{section.title || section.id}</h2>
                          <MarkdownRenderer
                            contentPath={`${SECTIONS_DIRECTORY}/${section.filename}`}
                            fallback={<p>Section content not found.</p>}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="about-error">
                <p>No sections found. Please check your content directory.</p>
                <pre>
                  {JSON.stringify({ sections, error, isLoading, ABOUT_CONTENT_PATH }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 