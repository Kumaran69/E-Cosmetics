# Glow Cosmetics - Frontend

React (Vite) frontend for a production-ready cosmetics e-commerce application (MERN stack).

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set the backend API URL:
   ```
   cp .env.example .env
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The app runs at `http://localhost:3000` and proxies `/api` calls to `http://localhost:5000` (see `vite.config.js`).

## Build for production

```
npm run build
```

This creates an optimized build in the `dist/` folder, ready to deploy to Netlify, Vercel, S3, or served
directly by the Express backend (see backend README — it serves `../frontend/dist` automatically when
`NODE_ENV=production`).

## Pages included
- Home, About Us, Contact Us, Privacy Policy, Terms & Conditions, FAQ
- Product listing (search, filter by category, sort, pagination) and Product Detail with shades & reviews
- Cart (add/update/remove items)
- Login, Sign Up, Forgot Password, Reset Password, Profile (with password management)
- Enquiry Form (product/contact questions) and Application Form (distributor/retail/bulk/career)
- Full Admin Panel: Dashboard stats, Product management (CRUD), Enquiries, Applications, Customers

## Notes for going further to production
- Wire up a payment gateway at checkout (Razorpay/Stripe) in `src/pages/Cart.jsx`.
- Add image upload (instead of pasting URLs) in the Admin Product form, using Cloudinary or S3.
- Add order history & order tracking pages once a checkout/payment flow is implemented.
- Consider adding pagination/infinite scroll tuning and SEO meta tags per page (React Helmet) for production SEO.
