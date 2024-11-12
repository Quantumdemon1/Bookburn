import { create } from 'zustand';
import { Cart, CartItem } from '../types/cart';
import { useBookStore } from './bookStore';

interface CartState {
  cart: Cart;
  addToCart: (bookId: string) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: {
    items: [],
    total: 0
  },

  addToCart: (bookId: string) => {
    const book = useBookStore.getState().books.find(b => b.id === bookId);
    if (!book) return;

    set(state => {
      const existingItem = state.cart.items.find(item => item.bookId === bookId);
      
      const updatedItems = existingItem
        ? state.cart.items.map(item =>
            item.bookId === bookId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...state.cart.items,
            {
              bookId,
              title: book.title,
              cover: book.cover,
              price: 9.99, // Example price, should come from book data
              quantity: 1
            }
          ];

      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        cart: {
          items: updatedItems,
          total
        }
      };
    });
  },

  removeFromCart: (bookId: string) => {
    set(state => {
      const updatedItems = state.cart.items.filter(item => item.bookId !== bookId);
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        cart: {
          items: updatedItems,
          total
        }
      };
    });
  },

  updateQuantity: (bookId: string, quantity: number) => {
    if (quantity < 1) return;

    set(state => {
      const updatedItems = state.cart.items.map(item =>
        item.bookId === bookId ? { ...item, quantity } : item
      );
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        cart: {
          items: updatedItems,
          total
        }
      };
    });
  },

  clearCart: () => {
    set({
      cart: {
        items: [],
        total: 0
      }
    });
  },

  checkout: async () => {
    const { cart } = get();
    if (cart.items.length === 0) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add books to user's purchased list and update recommendations
    const { addPreference } = useBookStore.getState();
    cart.items.forEach(item => {
      addPreference({
        bookId: item.bookId,
        userId: 'current-user', // Should come from auth store
        action: 'purchase',
        timestamp: Date.now(),
        weight: 2
      });
    });

    // Clear cart after successful purchase
    get().clearCart();
  }
}));