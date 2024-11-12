import { create } from 'zustand';
import { AuthState, RegisterData, User } from '../types/user';

// Simulated user data - replace with actual API calls
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  username: 'bookworm',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100',
  favoriteAuthors: ['J.R.R. Tolkien', 'George Orwell'],
  favoriteBooks: ['The Hobbit', '1984'],
  favoriteMovies: ['The Lord of the Rings', 'V for Vendetta'],
  bio: 'Avid reader and movie enthusiast',
  following: [],
  followers: []
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ user: mockUser, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  register: async (data: RegisterData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      username: data.username,
      favoriteAuthors: data.favoriteAuthors,
      favoriteBooks: data.favoriteBooks,
      favoriteMovies: data.favoriteMovies,
      bio: data.bio,
      following: [],
      followers: []
    };
    set({ user: newUser, isAuthenticated: true });
  }
}));