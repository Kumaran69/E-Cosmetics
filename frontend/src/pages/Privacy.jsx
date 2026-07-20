export default function Privacy() {
  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Legal</span>
      <h1>Privacy Policy</h1>
      <div className="stack" style={{ maxWidth: '70ch' }}>
        <p className="muted">
          We collect only the information needed to process your orders and improve your shopping
          experience: your name, email, shipping address, and order history. We never sell your
          personal data to third parties.
        </p>
        <p className="muted">
          Payment details are processed securely and are never stored on our servers. Cookies are
          used only to keep you logged in and remember your cart contents.
        </p>
        <p className="muted">
          You may request a copy of your data or ask us to delete your account at any time by
          contacting us through the Contact Us page.
        </p>
      </div>
    </div>
  );
}
