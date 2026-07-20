const slugify = require('slugify');
const BlogPost = require('../models/BlogPost');
const sampleBlogPosts = require('./data/sampleBlogPosts');

// insertMany() does NOT run Mongoose's pre('save') hooks, so slugs are
// generated explicitly here rather than relying on the BlogPost model's
// pre-save middleware (see the same fix applied to product auto-seeding).
const withSlugs = () =>
  sampleBlogPosts.map((p) => ({
    ...p,
    slug: slugify(`${p.title}-${Math.random().toString(36).slice(2, 7)}`, {
      lower: true,
      strict: true,
    }),
  }));

// Runs on every server startup. If the BlogPost collection is empty, inserts
// sample articles so the Beauty Blog has content immediately.
const autoSeedBlog = async () => {
  try {
    const count = await BlogPost.countDocuments();
    if (count > 0) {
      console.log(`BlogPost collection already has ${count} post(s) - skipping auto-seed.`);
      return;
    }
    await BlogPost.insertMany(withSlugs(), { ordered: false });
    console.log(`Auto-seed: inserted ${sampleBlogPosts.length} sample blog posts.`);
  } catch (err) {
    console.error(`Blog auto-seed error: ${err.message}`);
  }
};

module.exports = autoSeedBlog;
