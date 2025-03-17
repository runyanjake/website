import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import MarkdownRenderer from '../../components/ContentRenderer/MarkdownRenderer';
import PostList from './components/PostList';
import BlogPost from './components/BlogPost';
import { useMarkdownContent } from '../../utils/contentLoader';
import './blog.css';

// Fallback data in case content loading fails
const fallbackPosts = [
  {
    id: 'post-1',
    title: 'Where are my blog posts?',
    date: '1970-12-31',
    excerpt: 'Uh oh, blog posts are not loading!'
  },
  {
    id: 'post-2',
    title: 'That is not good.',
    date: '1970-12-31',
    excerpt: 'Can someone page the on-call engineer?'
  }
];

const BLOG_CONTENT_PATH = '/content/blog';
const POSTS_DIRECTORY = `${BLOG_CONTENT_PATH}/posts`;

export default function Blog() {
  const { postId } = useParams();
  
  // Use the hook at the top level of the component
  const { posts, isLoading, error } = useMarkdownContent(BLOG_CONTENT_PATH);

  // Add some debugging to see what's happening
  console.log('Blog component state:', { posts, isLoading, error, postId });

  // Render a single post
  if (postId) {
    if (isLoading) {
      return (
        <MainLayout>
          <div className="blog-post-container">
            <p>Loading post...</p>
          </div>
        </MainLayout>
      );
    }
    
    return (
      <MainLayout>
        <div className="blog-post-container">
          <MarkdownRenderer
            blogDirectory={BLOG_CONTENT_PATH}
            postId={postId}
            renderPost={(post) => (
              <BlogPost
                title={post.title}
                date={post.date}
                author={post.author}
                content={post.content}
              />
            )}
            fallback={
              <div>
                <h1>Post Not Found</h1>
                <p>Sorry, the post you're looking for could not be found.</p>
              </div>
            }
          />
        </div>
      </MainLayout>
    );
  }

  // Render the blog index
  return (
    <MainLayout>
      <div className="blog-list-container">
        <h1>Blog</h1>
        {isLoading ? (
          <p>Loading blog posts...</p>
        ) : error ? (
          <div>
            <p>Error loading blog posts: {error.message}</p>
            <PostList posts={fallbackPosts} />
          </div>
        ) : (
          <div>
            {posts && posts.length > 0 ? (
              <>
                <MarkdownRenderer
                  contentPath={`${BLOG_CONTENT_PATH}/index.md`}
                  fallback={<p>Some ramblings on various topics, hope you enjoy!</p>}
                />
                <PostList posts={posts} />
              </>
            ) : (
              <>
                <p>No blog posts found. Try again later!</p>
                <PostList posts={fallbackPosts} />
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 