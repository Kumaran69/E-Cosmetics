import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const links = [
  { to: '/products', label: 'Shop' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/best-sellers', label: 'Best Sellers' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="swatch-dot" /> Glow Cosmetics
        </Link>

        <nav className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {user && user.role !== 'admin' && (
            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
              <FiHeart />
              {wishlist.length > 0 && <span className="cart-count">{wishlist.length}</span>}
            </Link>
          )}

          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <FiShoppingBag />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="flex" style={{ gap: '0.8rem', alignItems: 'center' }}>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="icon-btn" aria-label="Account">
                <FiUser />
              </Link>
              <button
                className="btn-ghost"
                style={{ fontSize: '0.8rem', fontWeight: 600 }}
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">
              Log in
            </Link>
          )}

          <button
            className="mobile-toggle icon-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="stack" style={{ padding: '0 24px 1.2rem' }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/apply" onClick={() => setOpen(false)}>Partner With Us</NavLink>
        </nav>
      )}
    </header>
  );
}
