import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch {
      // silently ignore - user may not be authenticated yet
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1, shade) => {
    const res = await api.post('/cart', { productId, quantity, shade });
    setCart(res.data.data);
  };

  const updateItem = async (itemId, quantity) => {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    setCart(res.data.data);
  };

  const removeItem = async (itemId) => {
    const res = await api.delete(`/cart/${itemId}`);
    setCart(res.data.data);
  };

  const clearCart = async () => {
    const res = await api.delete('/cart');
    setCart(res.data.data);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, subtotal, addToCart, updateItem, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
