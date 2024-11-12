export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  genres: string[];
  likes: number;
  matches: number;
  price: number;
  likedBy: {
    id: string;
    avatar: string;
  }[];
  burnedBy: string[];
  purchasedBy: string[];
  similarBooks: string[];
  keywords: string[];
}

export interface BookPreference {
  bookId: string;
  userId: string;
  action: 'like' | 'burn' | 'purchase';
  timestamp: number;
  weight: number;
}

export interface UserPreferences {
  genres: Set<string>;
  keywords: Set<string>;
  likedAuthors: Set<string>;
  interactions: BookPreference[];
}