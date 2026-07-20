import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const categories = [
  'Skincare',
  'Makeup',
  'Haircare',
  'Fragrance',
  'Bath & Body',
  'Nail Care',
  'Tools & Accessories',
  "Men's Grooming",
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products', { params: { featured: true, limit: 8 } })
      .then((res) => setFeatured(res.data.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="container">
        <section className="hero">
          <div>
            <span className="eyebrow">
              <span className="swatch-dot" /> New Season Edit
            </span>
            <h1>Beauty, formulated to be worn &amp; loved daily.</h1>
            <p className="lede">
              Glow Cosmetics blends clean ingredients with rich, wearable color — skincare, makeup,
              haircare and fragrance for the way you actually get ready.
            </p>
            <div className="cta-row">
              <Link to="/products" className="btn btn-primary">
                Shop the Edit <FiArrowRight />
              </Link>
              <Link to="/products?category=Skincare" className="btn btn-outline">
                Explore Skincare
              </Link>
            </div>
          </div>
          <div className="swatch-collage">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700"
              alt="Cosmetics flat lay"
            />
            <img
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500"
              alt="Eyeshadow palette swatch"
            />
          </div>
        </section>

        <div className="swatch-divider">
          <span>
            <i className="swatch-dot" />
            <i className="swatch-dot" />
            <i className="swatch-dot" />
          </span>
        </div>

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <span className="eyebrow"><span className="swatch-dot" /> Shop by category</span>
              <h2>Find your routine</h2>
            </div>
          </div>
          <div className="chip-row">
            {categories.map((c) => (
              <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="chip">
                <span className="swatch-dot" /> {c}
              </Link>
            ))}
          </div>
        </section>

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <span className="eyebrow"><span className="swatch-dot" /> Editor's picks</span>
              <h2>Featured products</h2>
            </div>
            <Link to="/products" className="btn btn-ghost">
              View all <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <Loader />
          ) : featured.length === 0 ? (
            <p className="muted">Featured products will appear here once available.</p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
