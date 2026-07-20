import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <div className="brand" style={{ color: 'var(--cream)', marginBottom: '1rem' }}>
            <span className="swatch-dot" /> Glow Cosmetics
          </div>
          <p style={{ color: 'rgba(251,246,243,0.65)', fontSize: '0.85rem', maxWidth: '32ch' }}>
            Premium skincare, makeup, haircare and beauty essentials, formulated with care.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/best-sellers">Best Sellers</Link>
          <Link to="/products?category=Skincare">Skincare</Link>
          <Link to="/products?category=Makeup">Makeup</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/blog">Beauty Blog</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/apply">Distributor / Partner</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div>
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Glow Cosmetics. All rights reserved.
      </div>
    </footer>
  );
}
