import React from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, removeFromCart, updateQuantity, checkout } = useCartStore();

  const handleCheckout = async () => {
    await checkout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.items.map((item) => (
              <div key={item.bookId} className="flex gap-4 bg-gray-800 p-4 rounded-lg">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-20 h-28 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-[#FF1B4C] font-bold">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.bookId)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}

            {cart.items.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                Your cart is empty
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="p-4 border-t border-gray-800">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-[#FF1B4C]">
                  ${cart.total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#FF1B4C] text-white py-3 rounded-lg font-semibold hover:bg-[#E01543] transition-colors"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;