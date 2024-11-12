export interface CartItem {
  bookId: string;
  title: string;
  cover: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}