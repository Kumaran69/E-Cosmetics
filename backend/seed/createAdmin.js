// Standalone script: `npm run seed:admin`
// Creates (or updates) a default admin account using ADMIN_EMAIL / ADMIN_PASSWORD from .env.
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@glowcosmetics.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.ADMIN_NAME || 'Store Admin';

  let admin = await User.findOne({ email }).select('+password');

  if (admin) {
    admin.name = name;
    admin.password = password;
    admin.role = 'admin';
    await admin.save();
    console.log(`Existing admin account updated: ${email}`);
  } else {
    admin = await User.create({ name, email, password, role: 'admin' });
    console.log(`Admin account created: ${email}`);
  }

  console.log('You can now log in with these credentials (change the password after first login).');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
