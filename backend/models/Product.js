const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String },
    brand: { type: String, default: 'Glow Cosmetics' },
    category: {
      type: String,
      required: true,
      enum: [
        'Skincare',
        'Makeup',
        'Haircare',
        'Fragrance',
        'Bath & Body',
        'Nail Care',
        'Tools & Accessories',
        "Men's Grooming",
      ],
    },
    subCategory: { type: String },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    images: [{ type: String }],
    shades: [{ type: String }], // color/shade swatches for makeup items
    ingredients: { type: String },
    skinType: [{ type: String }], // e.g. Oily, Dry, Combination, Sensitive
    tags: [{ type: String }],
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(`${this.name}-${Math.random().toString(36).slice(2, 7)}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

productSchema.methods.recalculateRatings = function () {
  if (this.reviews.length === 0) {
    this.ratingsAverage = 0;
    this.ratingsCount = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.ratingsAverage = Math.round((total / this.reviews.length) * 10) / 10;
    this.ratingsCount = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
