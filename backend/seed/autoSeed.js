const slugify = require('slugify');
const Product = require('../models/Product');
const sampleProducts = require('./data/sampleProducts');

// insertMany() does NOT run Mongoose's pre('save') hooks, so we generate
// slugs here explicitly instead of relying on the Product model's pre-save
// middleware (which only fires on .save()/.create()).
const withSlugs = () =>
  sampleProducts.map((p) => ({
    ...p,
    slug: slugify(`${p.name}-${Math.random().toString(36).slice(2, 7)}`, {
      lower: true,
      strict: true,
    }),
  }));

// Runs on every server startup. If the Product collection is empty, inserts
// the sample catalog so the store has real data immediately. Does nothing
// if products already exist (e.g. an admin has added their own).
const autoSeedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Product collection already has ${count} product(s) - skipping auto-seed.`);
      return;
    }
    await Product.insertMany(withSlugs(), { ordered: false });
    console.log(`Auto-seed: inserted ${sampleProducts.length} sample products.`);
  } catch (err) {
    console.error(`Auto-seed error: ${err.message}`);
  }
};

module.exports = autoSeedProducts;