import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';

export const ChatRoom = () => {
  const { chatId } = useParams();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore(state => state.user);
  const { messages, sendMessage, markAsRead } = useMessageStore();

  const chatMessages = messages[chatId || ''] || [];

  useEffect(() => {
    if (chatId) {
      markAsRead(chatId);
    }
  }, [chatId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || !currentUser) return;

    const otherUserId = chatId.split('-').find(id => id !== currentUser.id);
    if (!otherUserId) return;

    sendMessage(otherUserId, message.trim());
    setMessage('');
  };

  if (!currentUser || !chatId) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => {
          const isSender = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isSender
                    ? 'bg-[#FF1B4C] text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF1B4C]"
          />
          <button
            type="submit"
            className="bg-[#FF1B4C] text-white p-2 rounded-lg hover:bg-[#E01543] transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;