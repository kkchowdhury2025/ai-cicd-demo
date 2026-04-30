// auth.DANGEROUS_DEMO.js
//
// ============================================================
// THIS FILE IS INTENTIONALLY BAD — FOR DEMO SCENARIO B ONLY
// Copy this file and rename it to auth.js to trigger the AI gate
// The AI will BLOCK this PR and explain exactly why
// ============================================================
//
// Problems the AI will catch:
// 1. Hardcoded Stripe live secret key in source code
// 2. Auth middleware REMOVED from /logout and /profile routes
// 3. User password being logged to the console

const express        = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// BAD: Hardcoded secret key — never commit secrets to source code
const STRIPE_SECRET_KEY = 'sk_live_51NxKqLJHGd7f8sKpQrT9mVwXzAbCdEfGh0123456789';

// BAD: Auth middleware completely removed from protected routes
router.post('/login',   authController.login);
router.post('/logout',  authController.logout);    // missing authMiddleware!
router.get('/profile',  authController.getProfile); // missing authMiddleware!

// BAD: Logging the user's raw password to the console
router.use((req, res, next) => {
  console.log('User password attempt:', req.body.password);
  next();
});

module.exports = router;
