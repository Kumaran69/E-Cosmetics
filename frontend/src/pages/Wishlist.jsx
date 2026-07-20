import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { wishlist, loading } = useWishlist();

  if (loading) return <Loader />;

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Saved for later</span>
      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <h2>Your wishlist is empty</h2>
          <p className="muted">Tap the heart icon on any product to save it here.</p>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
