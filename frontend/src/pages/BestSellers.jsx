import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products', { params: { bestseller: true, limit: 24 } })
      .then((res) => {
        // Fall back to top-rated products if no items are flagged as best sellers yet
        if (res.data.data.length > 0) {
          setProducts(res.data.data);
        } else {
          return api.get('/products', { params: { sort: 'rating', limit: 24 } }).then((r2) => setProducts(r2.data.data));
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Customer favorites</span>
      <h1>Best Sellers</h1>
      <p className="muted" style={{ maxWidth: '60ch', marginBottom: '2rem' }}>
        The products our customers keep coming back for.
      </p>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="empty-state">No best sellers to show yet.</div>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
