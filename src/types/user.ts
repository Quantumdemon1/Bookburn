export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  favoriteAuthors: string[];
  favoriteBooks: string[];
  favoriteMovies: string[];
  bio?: string;
  following: string[];
  followers: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  favoriteAuthors: string[];
  favoriteBooks: string[];
  favoriteMovies: string[];
  bio?: string;
}