const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: [true, 'Excerpt is required'], trim: true },
    content: { type: String, required: [true, 'Content is required'] },
    coverImage: { type: String },
    author: { type: String, default: 'Glow Cosmetics Team' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogPostSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(`${this.title}-${Math.random().toString(36).slice(2, 7)}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
