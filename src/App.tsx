import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Settings, UserCircle2, ShoppingBag, MessageCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BookCard from './components/BookCard';
import BookSwiper from './components/BookSwiper';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UserProfile from './components/profile/UserProfile';
import ChatList from './components/chat/ChatList';
import ChatRoom from './components/chat/ChatRoom';
import CartDrawer from './components/cart/CartDrawer';
import { useAuthStore } from './store/authStore';
import { useMessageStore } from './store/messageStore';
import { useCartStore } from './store/cartStore';
import { books } from './data/books';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const unreadCount = useMessageStore(state => state.getUnreadCount());
  const cartItemCount = useCartStore(state => state.cart.items.length);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#FF1B4C]">Book Burn</h1>
          <LoginForm />
          <p className="text-center mt-4 text-gray-400">
            Don't have an account? Sign up now!
          </p>
          <RegisterForm />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <header className="bg-[#FF1B4C] p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Book Burn</h1>
          <div className="flex gap-4">
            <div className="relative">
              <MessageCircle 
                className="w-6 h-6 cursor-pointer" 
                onClick={() => window.location.href = '/messages'}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#FF1B4C] text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <UserCircle2 className="w-6 h-6 cursor-pointer" />
            <Settings className="w-6 h-6 cursor-pointer" />
          </div>
        </header>

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<BookSwiper />} />
              <Route path="/browse" element={
                <>
                  <div className="mb-6 border-b border-gray-700">
                    <div className="flex gap-8">
                      <button className="text-[#FF1B4C] border-b-2 border-[#FF1B4C] pb-2">COVERS</button>
                      <button className="text-gray-400 pb-2">BACKS</button>
                      <button className="text-gray-400 pb-2">AUTHORS</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                      <BookCard key={book.id} {...book} />
                    ))}
                  </div>
                </>
              } />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/messages" element={<ChatList />} />
              <Route path="/messages/:chatId" element={<ChatRoom />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-6 bg-[#FF1B4C] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-[#E01543] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#FF1B4C] text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          BUY BOOKS
        </button>

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </Router>
  );
}

export default App;