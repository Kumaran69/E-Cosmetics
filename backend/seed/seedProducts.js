// Standalone script: `npm run seed:products`
// Wipes all existing products and reinserts the sample catalog.
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const slugify = require('slugify');
const connectDB = require('../config/db');
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

const run = async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(withSlugs(), { ordered: false });
  console.log(`Reset complete: inserted ${sampleProducts.length} sample products.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});