import React from 'react';
import { UserPlus, UserMinus, BookOpen } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import type { User } from '../../types/user';

interface UserCardProps {
  user: User;
  isFollowing: boolean;
}

const UserCard = ({ user, isFollowing }: UserCardProps) => {
  const { follow, unfollow } = useSocialStore();

  return (
    <div className="bg-gray-900 rounded-lg p-4 flex items-center gap-4">
      <img
        src={user.avatar || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`}
        alt={user.username}
        className="w-16 h-16 rounded-full"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold">{user.username}</h3>
        <p className="text-sm text-gray-400">{user.bio}</p>
        
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {user.favoriteBooks.length} books
          </span>
          <span>{user.followers.length} followers</span>
        </div>
      </div>

      <button
        onClick={() => isFollowing ? unfollow(user.id) : follow(user.id)}
        className={`p-2 rounded-full ${
          isFollowing
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            : 'bg-[#FF1B4C] text-white hover:bg-[#E01543]'
        } transition-colors`}
      >
        {isFollowing ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default UserCard;