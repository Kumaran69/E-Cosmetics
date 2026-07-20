import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page-section empty-state">
      <span className="eyebrow"><span className="swatch-dot" /> 404</span>
      <h1>Page not found</h1>
      <p className="muted">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
