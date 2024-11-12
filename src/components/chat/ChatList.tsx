import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';

export const ChatList = () => {
  const navigate = useNavigate();
  const chats = useMessageStore(state => state.chats);
  const currentUser = useAuthStore(state => state.user);

  if (!currentUser) return null;

  return (
    <div className="space-y-2">
      {chats.map(chat => {
        const otherParticipant = chat.participants.find(id => id !== currentUser.id);
        const lastMessage = chat.lastMessage;

        return (
          <div
            key={chat.id}
            onClick={() => navigate(`/messages/${chat.id}`)}
            className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <img
              src={`https://api.dicebear.com/7.x/avatars/svg?seed=${otherParticipant}`}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold truncate">User {otherParticipant}</h3>
                {lastMessage && (
                  <span className="text-sm text-gray-400">
                    {formatDistanceToNow(lastMessage.timestamp, { addSuffix: true })}
                  </span>
                )}
              </div>
              
              {lastMessage && (
                <p className="text-sm text-gray-400 truncate">
                  {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                  {lastMessage.content}
                </p>
              )}
            </div>

            {chat.unreadCount > 0 && (
              <div className="bg-[#FF1B4C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unreadCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;