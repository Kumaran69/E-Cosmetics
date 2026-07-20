const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are typically processed within 1-2 business days and delivered within 3-7 business days depending on your location.',
  },
  {
    q: 'What is your return policy?',
    a: 'Unopened products can be returned within 15 days of delivery for a full refund. Opened cosmetics cannot be returned for hygiene reasons unless defective.',
  },
  {
    q: 'Are your products cruelty-free?',
    a: 'Yes — none of our products or ingredients are tested on animals at any stage of development.',
  },
  {
    q: 'Do you offer bulk or distributor pricing?',
    a: "Yes, visit our Partner With Us page to submit a distributor, retail partner, or bulk order application.",
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you will receive a tracking link by email. You can also view order status from your Profile page.',
  },
];

export default function FAQ() {
  return (
    <div className="container page-section">
      <span className="eyebrow"><span className="swatch-dot" /> Support</span>
      <h1>Frequently asked questions</h1>
      <div className="stack" style={{ maxWidth: '70ch', marginTop: '2rem' }}>
        {faqs.map((f) => (
          <div key={f.q} className="form-card">
            <h3 style={{ fontSize: '1.1rem' }}>{f.q}</h3>
            <p className="muted" style={{ marginBottom: 0 }}>{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
