import React from 'react';
import { Link } from 'react-router-dom';

export default function FriendList({ friends }) {
  if (!friends || friends.length === 0) {
    return <p>No friends available.</p>;
  }

  return (
    <div className="friends-grid">
      {friends.map(friend => (
        <Link 
          key={friend.path}
          to={`/friends/${friend.path.split('/').pop().replace('.md', '')}`}
          className="friend-link"
        >
          <div className="friend-card">
            <img src={friend.image} alt={friend.name} />
            <h2>{friend.name}</h2>
            <p>{friend.website}</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 