import React, { useState, useEffect } from 'react';
import { Flame, Heart, ThumbsUp } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import type { Book } from '../types/book';

const BookSwiper = () => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { recommendedBooks, addPreference } = useBookStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (recommendedBooks.length > 0) {
      setCurrentBook(recommendedBooks[0]);
    }
  }, [recommendedBooks]);

  const handleAction = (action: 'burn' | 'like' | 'purchase') => {
    if (!currentBook || !user) return;

    const weight = action === 'burn' ? -1 : action === 'purchase' ? 2 : 1;
    
    addPreference({
      bookId: currentBook.id,
      userId: user.id,
      action,
      timestamp: Date.now(),
      weight
    });

    setDirection(action === 'burn' ? 'left' : 'right');
    
    // Animate card off screen
    setTimeout(() => {
      setCurrentBook(recommendedBooks[1]);
      setDirection(null);
    }, 300);
  };

  if (!currentBook) return null;

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      <div
        className={`absolute w-full h-full transition-transform duration-300 ${
          direction === 'left' ? '-translate-x-full rotate-[-20deg]' :
          direction === 'right' ? 'translate-x-full rotate-[20deg]' : ''
        }`}
      >
        <div className="relative h-full">
          <img
            src={currentBook.cover}
            alt={currentBook.title}
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h2 className="text-2xl font-bold mb-2">{currentBook.title}</h2>
            <p className="text-gray-300">{currentBook.description}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8">
        <button
          onClick={() => handleAction('burn')}
          className="bg-[#FF1B4C] p-4 rounded-full hover:bg-[#E01543] transition-colors shadow-lg"
        >
          <Flame className="w-8 h-8" />
        </button>
        
        <button
          onClick={() => handleAction('like')}
          className="bg-white p-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
        >
          <Heart className="w-8 h-8 text-[#FF1B4C]" />
        </button>
        
        <button
          onClick={() => handleAction('purchase')}
          className="bg-[#6B46C1] p-4 rounded-full hover:bg-[#553C9A] transition-colors shadow-lg"
        >
          <ThumbsUp className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default BookSwiper;