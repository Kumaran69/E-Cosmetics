import { Link } from 'react-router-dom';
import { FiUser, FiHeart, FiShoppingBag, FiBookOpen, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { itemCount } = useCart();

  const links = [
    {
      to: '/profile',
      icon: <FiUser />,
      title: 'Account Details',
      desc: 'Update your name, phone number, and password.',
    },
    {
      to: '/wishlist',
      icon: <FiHeart />,
      title: 'My Wishlist',
      desc: `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved for later.`,
    },
    {
      to: '/cart',
      icon: <FiShoppingBag />,
      title: 'My Cart',
      desc: `${itemCount} item${itemCount !== 1 ? 's' : ''} currently in your bag.`,
    },
    {
      to: '/blog',
      icon: <FiBookOpen />,
      title: 'Beauty Blog',
      desc: 'Read the latest skincare & makeup tips.',
    },
  ];

  return (
    <div className="container page-section">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow" style={{ color: 'var(--rose-soft)' }}>
            <span className="swatch-dot" style={{ background: 'var(--rose-soft)' }} /> My Account
          </span>
          <h2>Welcome back, {user?.name?.split(' ')[0]}</h2>
          <p>{user?.email}</p>
        </div>
        <Link to="/products" className="btn" style={{ background: 'var(--white)', color: 'var(--wine)' }}>
          Continue Shopping
        </Link>
      </div>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="dash-link-card">
            <span className="icon">{l.icon}</span>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>{l.title}</h3>
              <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>{l.desc}</p>
            </div>
          </Link>
        ))}
        {user?.addresses?.length === 0 && (
          <div className="dash-link-card">
            <span className="icon"><FiMapPin /></span>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Add a shipping address</h3>
              <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                Add one from your <Link to="/profile" style={{ color: 'var(--wine)', fontWeight: 600 }}>account details</Link>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
