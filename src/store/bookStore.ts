import { create } from 'zustand';
import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Book, BookPreference, UserPreferences } from '../types/book';
import { useAuthStore } from './authStore';

interface BookState {
  books: Book[];
  preferences: BookPreference[];
  recommendedBooks: Book[];
  addPreference: (preference: BookPreference) => Promise<void>;
  getRecommendations: () => Promise<Book[]>;
}

const calculateGenreSimilarity = (userGenres: Set<string>, bookGenres: string[]): number => {
  const intersection = new Set([...userGenres].filter(x => bookGenres.includes(x)));
  return intersection.size / Math.max(userGenres.size, bookGenres.length);
};

const calculateKeywordSimilarity = (userKeywords: Set<string>, bookKeywords: string[]): number => {
  const intersection = new Set([...userKeywords].filter(x => bookKeywords.includes(x)));
  return intersection.size / Math.max(userKeywords.size, bookKeywords.length);
};

const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  const prefsRef = doc(db, 'userPreferences', userId);
  const prefsDoc = await getDoc(prefsRef);
  return prefsDoc.data() as UserPreferences;
};

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  preferences: [],
  recommendedBooks: [],

  addPreference: async (preference: BookPreference) => {
    const prefRef = doc(db, 'preferences', `${preference.userId}-${preference.bookId}`);
    await setDoc(prefRef, preference);

    // Update user preferences
    const userPrefs = await getUserPreferences(preference.userId);
    const book = get().books.find(b => b.id === preference.bookId);
    
    if (book) {
      const updatedPrefs: UserPreferences = {
        genres: new Set([...userPrefs.genres, ...book.genres]),
        keywords: new Set([...userPrefs.keywords, ...book.keywords]),
        likedAuthors: new Set([...userPrefs.likedAuthors, book.author]),
        interactions: [...userPrefs.interactions, preference]
      };

      await setDoc(doc(db, 'userPreferences', preference.userId), updatedPrefs);
    }

    set(state => ({
      preferences: [...state.preferences, preference]
    }));
  },

  getRecommendations: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return [];

    const userPrefs = await getUserPreferences(userId);
    const state = get();

    // Get collaborative filtering data
    const similarUsersQuery = query(
      collection(db, 'userPreferences'),
      where('genres', 'array-contains-any', Array.from(userPrefs.genres))
    );
    const similarUsersSnapshot = await getDocs(similarUsersQuery);
    const similarUsers = similarUsersSnapshot.docs.map(doc => ({
      id: doc.id,
      prefs: doc.data() as UserPreferences
    }));

    // Calculate book scores
    const scoredBooks = state.books.map(book => {
      if (book.burnedBy.includes(userId)) return { book, score: -1 };

      // Content-based scoring
      const genreScore = calculateGenreSimilarity(userPrefs.genres, book.genres);
      const keywordScore = calculateKeywordSimilarity(userPrefs.keywords, book.keywords);
      const authorScore = userPrefs.likedAuthors.has(book.author) ? 1 : 0;

      // Collaborative filtering score
      const cfScore = similarUsers.reduce((acc, user) => {
        const userInteraction = user.prefs.interactions.find(i => i.bookId === book.id);
        if (userInteraction) {
          const similarity = calculateGenreSimilarity(userPrefs.genres, user.prefs.genres);
          return acc + (userInteraction.weight * similarity);
        }
        return acc;
      }, 0) / similarUsers.length;

      // Purchase boost
      const purchaseBoost = book.purchasedBy.length * 0.2;

      // Temporal decay for very old interactions
      const recencyBoost = userPrefs.interactions
        .filter(i => i.bookId === book.id)
        .reduce((acc, i) => {
          const daysAgo = (Date.now() - i.timestamp) / (1000 * 60 * 60 * 24);
          return acc + (i.weight * Math.exp(-daysAgo / 30)); // 30-day half-life
        }, 0);

      const totalScore = (
        genreScore * 0.3 +
        keywordScore * 0.2 +
        authorScore * 0.15 +
        cfScore * 0.25 +
        purchaseBoost * 0.05 +
        recencyBoost * 0.05
      );

      return { book, score: totalScore };
    });

    const recommendations = scoredBooks
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.book);

    set({ recommendedBooks: recommendations });
    return recommendations;
  }
}));