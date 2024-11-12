export interface Activity {
  id: string;
  userId: string;
  type: 'like' | 'burn' | 'purchase' | 'follow' | 'review';
  targetId: string;
  timestamp: number;
  metadata?: {
    rating?: number;
    review?: string;
    bookTitle?: string;
  };
}

export interface UserRecommendation {
  user: {
    id: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  score: number;
  commonInterests: string[];
  mutualFriends: number;
}