import { create } from 'zustand';
import { collection, doc, setDoc, getDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from '../types/user';
import type { Activity, UserRecommendation } from '../types/social';
import { useAuthStore } from './authStore';
import { useBookStore } from './bookStore';

interface SocialState {
  followers: User[];
  following: User[];
  recommendations: UserRecommendation[];
  activities: Activity[];
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
  getRecommendedUsers: () => Promise<UserRecommendation[]>;
  getUserReadingStats: (userId: string) => Promise<ReadingStats>;
  getFeedActivities: () => Promise<Activity[]>;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => Promise<void>;
}

interface ReadingStats {
  booksRead: number;
  favoriteGenres: { genre: string; count: number }[];
  readingStreak: number;
  totalPages: number;
}

const calculateUserSimilarity = (user1: User, user2: User): number => {
  const genreOverlap = user1.favoriteBooks.filter(book => 
    user2.favoriteBooks.includes(book)
  ).length;
  
  const authorOverlap = user1.favoriteAuthors.filter(author => 
    user2.favoriteAuthors.includes(author)
  ).length;
  
  const movieOverlap = user1.favoriteMovies.filter(movie => 
    user2.favoriteMovies.includes(movie)
  ).length;

  return (genreOverlap * 0.5 + authorOverlap * 0.3 + movieOverlap * 0.2) / 
    Math.max(user1.favoriteBooks.length, user2.favoriteBooks.length);
};

const getMutualFriends = (user1: User, user2: User): string[] => {
  return user1.following.filter(id => user2.followers.includes(id));
};

export const useSocialStore = create<SocialState>((set, get) => ({
  followers: [],
  following: [],
  recommendations: [],
  activities: [],

  follow: async (userId: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUser.id);

    await setDoc(userRef, { 
      followers: [...get().followers, currentUser.id] 
    }, { merge: true });

    await setDoc(currentUserRef, { 
      following: [...get().following, userId] 
    }, { merge: true });

    await get().addActivity({
      userId: currentUser.id,
      type: 'follow',
      targetId: userId
    });
    
    set(state => ({
      following: [...state.following, userId]
    }));
  },

  unfollow: async (userId: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUser.id);

    await setDoc(userRef, { 
      followers: get().followers.filter(id => id !== currentUser.id) 
    }, { merge: true });

    await setDoc(currentUserRef, { 
      following: get().following.filter(id => id !== userId) 
    }, { merge: true });
    
    set(state => ({
      following: state.following.filter(id => id !== userId)
    }));
  },

  getRecommendedUsers: async () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return [];

    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as User))
      .filter(user => 
        user.id !== currentUser.id && 
        !get().following.includes(user.id)
      );

    const recommendations = users.map(user => {
      const similarity = calculateUserSimilarity(currentUser, user);
      const mutualFriends = getMutualFriends(currentUser, user);
      const commonInterests = user.favoriteBooks
        .filter(book => currentUser.favoriteBooks.includes(book));

      return {
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio
        },
        score: similarity * 0.7 + (mutualFriends.length * 0.3),
        commonInterests,
        mutualFriends: mutualFriends.length
      };
    });

    const sortedRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    set({ recommendations: sortedRecommendations });
    return sortedRecommendations;
  },

  getUserReadingStats: async (userId: string) => {
    const statsRef = doc(db, 'readingStats', userId);
    const statsDoc = await getDoc(statsRef);
    return statsDoc.data() as ReadingStats;
  },

  getFeedActivities: async () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return [];

    const following = [...get().following, currentUser.id];
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('userId', 'in', following),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Activity[];

    set({ activities });
    return activities;
  },

  addActivity: async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const activityRef = doc(collection(db, 'activities'));
    const newActivity: Activity = {
      ...activity,
      id: activityRef.id,
      timestamp: Date.now()
    };

    await setDoc(activityRef, newActivity);

    set(state => ({
      activities: [newActivity, ...state.activities]
    }));
  }
}));