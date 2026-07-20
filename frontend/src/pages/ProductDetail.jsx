import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shade, setShade] = useState('');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState({ loading: false, error: '', success: '' });

  const loadProduct = () => {
    setLoading(true);
    api
      .get(`/products/${idOrSlug}`)
      .then((res) => {
        setProduct(res.data.data);
        if (res.data.data.shades?.length) setShade(res.data.data.shades[0]);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOrSlug]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please log in to add items to your cart');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, qty, shade || undefined);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
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

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewStatus({ loading: true, error: '', success: '' });
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      setReviewStatus({ loading: false, error: '', success: 'Thanks for your review!' });
      setReviewForm({ rating: 5, comment: '' });
      loadProduct();
    } catch (err) {
      setReviewStatus({ loading: false, error: err.message, success: '' });
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div className="container page-section empty-state">Product not found.</div>;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="container page-section">
      <div className="pdp-grid">
        <div className="pdp-gallery">
          <img src={product.images?.[0]} alt={product.name} />
        </div>
        <div>
          <span className="eyebrow"><span className="swatch-dot" /> {product.category}</span>
          <h1 style={{ fontSize: '2rem' }}>{product.name}</h1>
          {product.ratingsCount > 0 && (
            <div className="rating" style={{ marginBottom: '1rem' }}>
              <FiStar /> {product.ratingsAverage.toFixed(1)} <span className="muted">({product.ratingsCount} reviews)</span>
            </div>
          )}
          <div style={{ marginBottom: '1.2rem' }}>
            <span className="price" style={{ fontSize: '1.6rem' }}>₹{displayPrice}</span>
            {hasDiscount && <span className="price-strike" style={{ marginLeft: '0.8rem' }}>₹{product.price}</span>}
          </div>
          <p className="muted">{product.description}</p>

          {product.shades?.length > 0 && (
            <div style={{ margin: '1.2rem 0' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Shade</label>
              <div className="shade-row">
                {product.shades.map((s) => (
                  <button key={s} className={`shade-chip ${shade === s ? 'active' : ''}`} onClick={() => setShade(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex" style={{ gap: '1rem', alignItems: 'center', margin: '1.5rem 0' }}>
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button className="btn btn-primary" disabled={product.stock === 0 || adding} onClick={handleAddToCart}>
              <FiShoppingBag /> {product.stock === 0 ? 'Sold out' : adding ? 'Adding...' : 'Add to cart'}
            </button>
            <button
              className="btn btn-outline"
              onClick={handleWishlistToggle}
              aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart fill={isWishlisted(product._id) ? 'var(--rose)' : 'none'} />
            </button>
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <p style={{ color: 'var(--wine)', fontSize: '0.82rem' }}>Only {product.stock} left in stock</p>
          )}
        </div>
      </div>

      <div className="swatch-divider">
        <span><i className="swatch-dot" /><i className="swatch-dot" /><i className="swatch-dot" /></span>
      </div>

      <section>
        <h2>Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="muted">No reviews yet — be the first to share your thoughts.</p>
        ) : (
          <div style={{ maxWidth: 640 }}>
            {product.reviews.map((r) => (
              <div key={r._id} className="review-item">
                <div className="rev-head">
                  <strong>{r.name}</strong>
                  <span className="rating"><FiStar /> {r.rating}</span>
                </div>
                <p className="muted" style={{ marginBottom: 0 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <div className="form-card" style={{ maxWidth: 480, marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Write a review</h3>
            {reviewStatus.error && <div className="form-error">{reviewStatus.error}</div>}
            {reviewStatus.success && <div className="form-success">{reviewStatus.success}</div>}
            <form onSubmit={submitReview}>
              <div className="field">
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                />
              </div>
              <button className="btn btn-primary" disabled={reviewStatus.loading}>
                {reviewStatus.loading ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          </div>
        ) : (
          <p className="muted" style={{ marginTop: '1.5rem' }}>
            <Link to="/login" style={{ color: 'var(--wine)', fontWeight: 600 }}>Log in</Link> to write a review.
          </p>
        )}
      </section>
    </div>
  );
}
