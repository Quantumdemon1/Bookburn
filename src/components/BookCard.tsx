import React from 'react';
import { Flame, Heart, ThumbsUp } from 'lucide-react';

interface BookCardProps {
  id: string;
  cover: string;
  title: string;
  likes: number;
  matches: number;
  likedBy: {
    avatar: string;
  };
}

const BookCard = ({ cover, likes, matches, likedBy }: BookCardProps) => {
  return (
    <div className="relative group">
      <img 
        src={cover} 
        alt="Book cover" 
        className="w-full aspect-[3/4] object-cover rounded-lg"
      />
      
      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FF1B4C] to-transparent p-4 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{matches}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{likes}</span>
          </div>
        </div>
        
        {/* Liked By */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm">Liked by:</span>
          <img 
            src={likedBy.avatar} 
            alt="User avatar" 
            className="w-6 h-6 rounded-full border-2 border-white"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="bg-[#FF1B4C] p-3 rounded-full hover:bg-[#E01543] transition-colors">
          <Flame className="w-6 h-6" />
        </button>
        <button className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors">
          <Heart className="w-6 h-6 text-[#FF1B4C]" />
        </button>
        <button className="bg-[#6B46C1] p-3 rounded-full hover:bg-[#553C9A] transition-colors">
          <ThumbsUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default BookCard;