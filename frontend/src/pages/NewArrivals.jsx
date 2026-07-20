import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products', { params: { sort: 'newest', limit: 24 } })
      .then((res) => setProducts(res.data.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Just landed</span>
      <h1>New Arrivals</h1>
      <p className="muted" style={{ maxWidth: '60ch', marginBottom: '2rem' }}>
        The newest additions to Glow Cosmetics, freshly stocked.
      </p>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="empty-state">No new products yet — check back soon.</div>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
