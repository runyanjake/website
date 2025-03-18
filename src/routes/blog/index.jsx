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

export default function Blog() {
  const { postId } = useParams();
  const { posts, isLoading, error } = useMarkdownContent(BLOG_CONTENT_PATH);

  console.log('Blog posts:', posts);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="blog-post-container">
          <p>Loading blog posts...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="blog-post-container">
          <p>Error loading blog posts: {error.message}</p>
        </div>
      </MainLayout>
    );
  }

  // Render a single post
  if (postId) {
    const currentPost = posts.find(post => post.slug === postId);
    
    if (!currentPost) {
      return (
        <MainLayout>
          <div className="blog-post-container">
            <h1>Post Not Found</h1>
            <p>Sorry, the post you're looking for could not be found.</p>
          </div>
        </MainLayout>
      );
    }

    return (
      <MainLayout>
        <div className="blog-post-container">
          <BlogPost
            title={currentPost.title}
            date={currentPost.date}
            author={currentPost.author}
            path={currentPost.path}
            slug={currentPost.slug}
            fullView={true}
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
        <MarkdownRenderer
          contentPath={`${BLOG_CONTENT_PATH}/index.md`}
          fallback={<p>Some ramblings on various topics, hope you enjoy!</p>}
        />
        {posts && posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="blog-error">
            <p>No blog posts found. Check back later!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 