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
const FRIENDS_DIRECTORY = `${FRIENDS_CONTENT_PATH}/posts`;

export default function Friends() {
  const { friendId } = useParams();
  
  // Use the hook at the top level of the component
  const { posts: friends, isLoading, error } = useMarkdownContent(FRIENDS_CONTENT_PATH, 'friends');

  // Add some debugging to see what's happening
  console.log('Friends component state:', { friends, isLoading, error, friendId });

  // Render a single friend
  if (friendId) {
    if (isLoading) {
      return (
        <MainLayout>
          <div className="friend-container">
            <p>Loading friend information...</p>
          </div>
        </MainLayout>
      );
    }
    
    return (
      <MainLayout>
        <div className="friend-container">
          <MarkdownRenderer
            blogDirectory={FRIENDS_CONTENT_PATH}
            postId={friendId}
            renderPost={(friend) => (
              <FriendCard
                name={friend.name}
                website={friend.website}
                image={friend.image}
                content={friend.content}
                fullView={true}
              />
            )}
            fallback={
              <div>
                <h1>Friend Not Found</h1>
                <p>Sorry, the friend you're looking for could not be found.</p>
              </div>
            }
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
        {isLoading ? (
          <p>Loading friends...</p>
        ) : error ? (
          <div>
            <p>Error loading friends: {error.message}</p>
            <FriendList friends={fallbackFriends} />
          </div>
        ) : (
          <div>
            {friends && friends.length > 0 ? (
              <>
                <MarkdownRenderer
                  contentPath={`${FRIENDS_CONTENT_PATH}/index.md`}
                  fallback={<p>Check out some of my amazing friends!</p>}
                />
                <FriendList friends={friends} />
              </>
            ) : (
              <>
                <p>No friends found. Try again later!</p>
                <FriendList friends={fallbackFriends} />
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 