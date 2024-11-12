import { create } from 'zustand';
import { Message, Chat } from '../types/message';
import { useAuthStore } from './authStore';

interface MessageState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  sendMessage: (receiverId: string, content: string) => void;
  markAsRead: (chatId: string) => void;
  getUnreadCount: () => number;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  chats: [],
  messages: {},

  sendMessage: (receiverId: string, content: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: userId,
      receiverId,
      content,
      timestamp: Date.now(),
      read: false,
    };

    const chatId = [userId, receiverId].sort().join('-');
    
    set(state => {
      const existingChat = state.chats.find(c => c.id === chatId);
      const updatedChats = existingChat
        ? state.chats.map(chat => 
            chat.id === chatId 
              ? { ...chat, lastMessage: newMessage, unreadCount: chat.unreadCount + 1 }
              : chat
          )
        : [...state.chats, {
            id: chatId,
            participants: [userId, receiverId],
            lastMessage: newMessage,
            unreadCount: 1
          }];

      return {
        chats: updatedChats,
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), newMessage]
        }
      };
    });
  },

  markAsRead: (chatId: string) => {
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map(msg => ({ ...msg, read: true }))
      }
    }));
  },

  getUnreadCount: () => {
    const state = get();
    return state.chats.reduce((acc, chat) => acc + chat.unreadCount, 0);
  }
}));