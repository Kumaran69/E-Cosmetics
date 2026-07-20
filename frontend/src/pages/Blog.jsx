import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/blog', { params: { limit: 12 } })
      .then((res) => setPosts(res.data.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Beauty Journal</span>
      <h1>The Glow Blog</h1>
      <p className="muted" style={{ maxWidth: '60ch', marginBottom: '2rem' }}>
        Skincare routines, makeup tips, ingredient breakdowns, and seasonal trends from our team.
      </p>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <div className="empty-state">No articles published yet — check back soon.</div>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post._id} to={`/blog/${post.slug}`} className="blog-card">
              <div className="cover">
                {post.coverImage && <img src={post.coverImage} alt={post.title} loading="lazy" />}
              </div>
              <div className="body">
                <span className="blog-meta">
                  {post.author} · {new Date(post.publishedAt).toLocaleDateString()}
                </span>
                <h3 style={{ fontSize: '1.1rem' }}>{post.title}</h3>
                <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 0 }}>{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div className="tag-row">
                    {post.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
