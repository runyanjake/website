import React from 'react';
import { Link } from 'react-router-dom';
import FriendCard from './FriendCard';

export default function FriendList({ friends }) {
  if (!friends || friends.length === 0) {
    return <p>No friends available.</p>;
  }

  return (
    <div className="friends-grid">
      {friends.map(friend => (
        <div key={friend.id} className="friend-item">
          <FriendCard
            name={friend.name}
            website={friend.website}
            image={friend.image}
            content={friend.excerpt}
            linkTo={`/friends/${friend.slug || friend.id}`}
          />
        </div>
      ))}
    </div>
  );
} 