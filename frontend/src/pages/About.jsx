export default function About() {
  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Our story</span>
      <h1>About Glow Cosmetics</h1>
      <p className="lede" style={{ maxWidth: '70ch' }}>
        Glow Cosmetics was founded on a simple idea: beauty products should be as thoughtful about
        what's in them as they are about how they perform. Every formula in our skincare, makeup,
        haircare, and fragrance lines is developed with clean, effective ingredients and tested for
        real everyday wear.
      </p>
      <div className="swatch-divider">
        <span><i className="swatch-dot" /><i className="swatch-dot" /><i className="swatch-dot" /></span>
      </div>
      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))' }}>
        <div className="form-card">
          <h3>Clean formulations</h3>
          <p className="muted">Every product is developed without harsh sulfates or parabens, and tested on real skin types before launch.</p>
        </div>
        <div className="form-card">
          <h3>Made to be worn daily</h3>
          <p className="muted">We design for real routines — lightweight textures, buildable coverage, and shades that work across skin tones.</p>
        </div>
        <div className="form-card">
          <h3>Built with our community</h3>
          <p className="muted">Product feedback from our customers directly shapes new shades, scents, and formulas each season.</p>
        </div>
      </div>
    </div>
  );
}
