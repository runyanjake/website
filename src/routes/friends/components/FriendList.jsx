import React from 'react';
import FriendCard from './FriendCard';

export default function FriendList({ friends }) {
  if (!friends || friends.length === 0) {
    return <p>No friends available.</p>;
  }

  return (
    <div className="friends-grid">
      {friends.map(friend => (
        <FriendCard
          key={friend.slug}
          title={friend.title}
          website={friend.website}
          image={friend.image}
          slug={friend.slug}
          path={friend.path}
        />
      ))}
    </div>
  );
} 