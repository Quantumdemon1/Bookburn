import { Book } from '../types/book';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=600',
    description: 'A fantasy novel about a hobbit who goes on an unexpected journey.',
    genres: ['Fantasy', 'Adventure'],
    likes: 350,
    matches: 120,
    price: 14.99,
    likedBy: [
      { id: 'user1', avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=1' }
    ],
    burnedBy: [],
    purchasedBy: ['user2', 'user3'],
    similarBooks: ['2', '5'],
    keywords: ['dragons', 'magic', 'quest', 'ring']
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600',
    description: 'A dystopian novel about totalitarian surveillance society.',
    genres: ['Science Fiction', 'Dystopian'],
    likes: 450,
    matches: 205,
    price: 12.99,
    likedBy: [
      { id: 'user2', avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=2' }
    ],
    burnedBy: [],
    purchasedBy: ['user1'],
    similarBooks: ['3', '7'],
    keywords: ['dystopia', 'surveillance', 'politics', 'rebellion']
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600',
    description: 'A novel about the American Dream in the Roaring Twenties.',
    genres: ['Literary Fiction', 'Classic'],
    likes: 380,
    matches: 108,
    price: 11.99,
    likedBy: [
      { id: 'user3', avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=3' }
    ],
    burnedBy: [],
    purchasedBy: ['user4'],
    similarBooks: ['4', '6'],
    keywords: ['jazz age', 'wealth', 'romance', 'tragedy']
  }
];