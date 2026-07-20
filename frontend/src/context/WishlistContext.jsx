import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.data);
    } catch {
      // ignore - user may not be authenticated yet
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = (productId) => wishlist.some((p) => p._id === productId);

  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlist(res.data.data);
      return false;
    }
    const res = await api.post(`/wishlist/${productId}`);
    setWishlist(res.data.data);
    return true;
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, isWishlisted, toggleWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
