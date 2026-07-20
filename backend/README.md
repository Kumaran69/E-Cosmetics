# Glow Cosmetics - Backend API

Node.js / Express / MongoDB backend for a production-ready cosmetics e-commerce application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
3. Make sure MongoDB is running locally, or set `MONGO_URI` to a MongoDB Atlas connection string.
4. Seed a default admin account:
   ```
   npm run seed:admin
   ```
5. Start the development server:
   ```
   npm run dev
   ```
   The API will run at `http://localhost:5000/api`.

## Sample product data (auto-seed)

On every startup, the server checks if the `Product` collection is empty. If it is, it automatically
inserts ~18 sample cosmetics products spanning every category (Skincare, Makeup, Haircare, Fragrance,
Bath & Body, Nail Care, Tools & Accessories, Men's Grooming) — see `seed/autoSeed.js` and
`seed/data/sampleProducts.js`. This means search, filtering, and sorting have real data to work with
immediately, with no manual step required.

If products already exist (e.g. an admin added their own), auto-seed does nothing and leaves your data
untouched. To force a full reset back to the sample catalog at any time:
```
npm run seed:products
```
This wipes all existing products and reinserts the sample catalog.

## Production

```
NODE_ENV=production npm start
```

If you place a built React frontend at `../frontend/dist`, this server will serve it automatically
when `NODE_ENV=production`, so you can deploy backend + frontend as a single service.

## API Overview

| Feature | Route prefix |
|---|---|
| Auth (signup/login/Google OAuth/forgot-reset password/profile) | `/api/auth` |
| Products (CRUD, search, filter, reviews, best sellers) | `/api/products` |
| Cart | `/api/cart` |
| Wishlist | `/api/wishlist` |
| Beauty Blog (articles) | `/api/blog` |
| Contact / Enquiry form | `/api/enquiries` |
| Distributor / Partner Application form | `/api/applications` |
| Admin dashboard & user management | `/api/admin` |

All admin-only routes require a valid JWT belonging to a user with `role: "admin"`.

## Google OAuth setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create an OAuth 2.0 Client ID (Application type: Web application).
3. Add `http://localhost:3000` to **Authorized JavaScript origins** (add your production domain too when deploying).
4. Copy the Client ID into `GOOGLE_CLIENT_ID` in this project's `.env`, and into `VITE_GOOGLE_CLIENT_ID` in the frontend's `.env`.
5. No client secret is needed for this flow — the frontend gets an ID token via Google Identity Services, and the backend verifies it server-side with `google-auth-library`.

## Security features included
- Password hashing with bcrypt
- JWT authentication
- Helmet security headers
- express-mongo-sanitize (NoSQL injection protection)
- xss-clean (basic XSS sanitization)
- Rate limiting on auth endpoints
- Centralized error handling with express-validator input validation

## Notes for going further to production
- Configure a real SMTP provider (SendGrid, Mailgun, AWS SES, Gmail App Password) for password reset & notification emails. Without SMTP env vars set, emails are simply logged to the console.
- Add a payment gateway (Razorpay/Stripe) for checkout — the Cart module is ready to plug an order/checkout flow into.
- Move product images to a cloud storage/CDN (Cloudinary, AWS S3) instead of using raw URLs.
- Add automated tests (Jest/Supertest) before deploying to production.
- Put this behind HTTPS (e.g. via a reverse proxy like Nginx, or your hosting provider's TLS).
