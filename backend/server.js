const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const connectDB = require('./config/db');
const autoSeedProducts = require('./seed/autoSeed');
const autoSeedBlog = require('./seed/autoSeedBlog');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to MongoDB, then auto-seed sample products and blog posts if the
// database is empty so browsing has real data to work with out of the box.
connectDB().then(() => {
  autoSeedProducts();
  autoSeedBlog();
});

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting (protect auth endpoints & overall API from abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

// Serve frontend build in production — ONLY if a build actually exists
// alongside this deployment (combined single-service mode). In a split
// deployment (backend as its own Render service, frontend as a separate
// Static Site), frontend/dist will never exist here, so this falls back
// to a plain API-only response instead of crashing with ENOENT.
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  const indexPath = path.join(frontendBuildPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    app.use(express.static(frontendBuildPath));
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    app.get('/', (req, res) => {
      res.json({ success: true, message: 'Cosmetics E-commerce API - Production Mode' });
    });
  }
} else {
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'Cosmetics E-commerce API - Development Mode' });
  });
}

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});