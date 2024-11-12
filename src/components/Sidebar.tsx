import React from 'react';
import { BookOpen, Flame, Heart, Clock, Users2 } from 'lucide-react';

const Sidebar = () => {
  return (
    <nav className="w-48 bg-black border-r border-gray-800 p-4 space-y-6">
      <div className="flex items-center gap-3 text-gray-300 hover:text-[#FF1B4C] cursor-pointer">
        <BookOpen className="w-5 h-5" />
        <span>Covers</span>
      </div>
      <div className="flex items-center gap-3 text-[#FF1B4C] cursor-pointer">
        <Flame className="w-5 h-5" />
        <span>Match</span>
      </div>
      <div className="flex items-center gap-3 text-gray-300 hover:text-[#FF1B4C] cursor-pointer">
        <Heart className="w-5 h-5" />
        <span>Favorites</span>
      </div>
      <div className="flex items-center gap-3 text-gray-300 hover:text-[#FF1B4C] cursor-pointer">
        <Clock className="w-5 h-5" />
        <span>Recent</span>
      </div>
      <div className="flex items-center gap-3 text-gray-300 hover:text-[#FF1B4C] cursor-pointer">
        <Users2 className="w-5 h-5" />
        <span>Friends</span>
      </div>
    </nav>
  );
};

export default Sidebar;