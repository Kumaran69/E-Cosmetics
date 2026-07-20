import { Link } from 'react-router-dom';
import { FiStar, FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const wishlisted = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to save items to your wishlist');
      return;
    }
    try {
      const added = await toggleWishlist(product._id);
      toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Link to={`/products/${product.slug || product._id}`} className="product-card">
      <div className="thumb" style={{ position: 'relative' }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--cream-deep)' }} />
        )}
        <button
          className="wishlist-heart"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart fill={wishlisted ? 'var(--rose)' : 'none'} color={wishlisted ? 'var(--rose)' : 'var(--ink)'} />
        </button>
        {product.isBestSeller && <span className="badge badge-corner">Best Seller</span>}
      </div>
      <div className="body">
        <span className="cat">{product.category}</span>
        <h3>{product.name}</h3>
        {product.ratingsCount > 0 && (
          <div className="rating">
            <FiStar /> {product.ratingsAverage.toFixed(1)}{' '}
            <span className="muted">({product.ratingsCount})</span>
          </div>
        )}
        <div className="price-row">
          <span className="price">₹{displayPrice}</span>
          {hasDiscount && <span className="price-strike">₹{product.price}</span>}
          {product.stock === 0 && <span className="badge badge-out">Sold out</span>}
        </div>
      </div>
    </Link>
  );
}
