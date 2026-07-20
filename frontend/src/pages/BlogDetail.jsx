import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/blog/${slug}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!post) {
    return (
      <div className="container page-section empty-state">
        <h2>Article not found</h2>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="container page-section" style={{ maxWidth: 760 }}>
      <span className="eyebrow"><span className="swatch-dot" /> Beauty Journal</span>
      <h1>{post.title}</h1>
      <p className="blog-meta">
        {post.author} · {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      {post.tags?.length > 0 && (
        <div className="tag-row" style={{ marginBottom: '1.5rem' }}>
          {post.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
        </div>
      )}
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} style={{ borderRadius: 'var(--radius-lg)', marginBottom: '2rem', width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
      )}
      <div className="blog-content">
        {post.content.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="swatch-divider">
        <span><i className="swatch-dot" /><i className="swatch-dot" /><i className="swatch-dot" /></span>
      </div>
      <Link to="/blog" className="btn btn-outline">← Back to Blog</Link>
    </div>
  );
}
