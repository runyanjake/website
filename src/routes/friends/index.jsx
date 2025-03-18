import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import MarkdownRenderer from '../../components/ContentRenderer/MarkdownRenderer';
import FriendList from './components/FriendList';
import FriendCard from './components/FriendCard';
import { useMarkdownContent } from '../../utils/contentLoader';
import './friends.css';

// Fallback data in case content loading fails
const fallbackFriends = [
  {
    id: 'friend-1',
    name: 'Missing Friend',
    website: '#',
    image: 'https://via.placeholder.com/150',
    excerpt: 'Friend information could not be loaded.'
  }
];

const FRIENDS_CONTENT_PATH = '/content/friends';

export default function Friends() {
  const { friendId } = useParams();
  const { posts: friends, isLoading, error } = useMarkdownContent(FRIENDS_CONTENT_PATH);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="friend-container">
          <p>Loading friends...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="friend-container">
          <p>Error loading friends: {error.message}</p>
        </div>
      </MainLayout>
    );
  }

  // Render a single friend
  if (friendId) {
    const currentFriend = friends.find(friend => friend.slug === friendId);

    if (!currentFriend) {
      return (
        <MainLayout>
          <div className="friend-container">
            <h1>Friend Not Found</h1>
            <p>Sorry, the friend you're looking for could not be found.</p>
          </div>
        </MainLayout>
      );
    }

    return (
      <MainLayout>
        <div className="friend-container">
          <FriendCard
            title={currentFriend.title}
            website={currentFriend.website}
            image={currentFriend.image}
            path={currentFriend.path}
            slug={currentFriend.slug}
            fullView={true}
          />
        </div>
      </MainLayout>
    );
  }

  // Render the friends index
  return (
    <MainLayout>
      <div className="friends-list-container">
        <h1>Friends</h1>
        <MarkdownRenderer
          contentPath={`${FRIENDS_CONTENT_PATH}/index.md`}
          fallback={<p>Check out some of my amazing friends!</p>}
        />
        {friends && friends.length > 0 ? (
          <FriendList friends={friends} />
        ) : (
          <div className="friends-error">
            <p>No friends found. Try again later!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 