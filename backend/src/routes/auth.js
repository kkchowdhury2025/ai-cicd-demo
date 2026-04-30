// auth.js — SAFE VERSION (this is the good file)
// Auth middleware is correctly applied to all protected routes

const express     = require('express');
const rateLimit   = require('express-rate-limit');
const authMiddleware  = require('../middleware/authMiddleware');
const authController  = require('../controllers/authController');

const router = express.Router();

// Rate limiter — max 10 login attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
});

// Public route — no auth needed
router.post('/login', loginLimiter, authController.login);

// Protected routes — authMiddleware MUST stay on these
router.post('/logout',  authMiddleware, authController.logout);
router.get('/profile',  authMiddleware, authController.getProfile);

module.exports = router;
