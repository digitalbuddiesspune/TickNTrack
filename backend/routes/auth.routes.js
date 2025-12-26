import { Router } from 'express';
import jwt from 'jsonwebtoken';
// COMMENTED OUT: passport import - uncomment if Google OAuth is re-enabled
// import passport from '../config/passport.js';
import { signup, signin, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { sendOtp } from '../controllers/sendOtp.js';
import { verifyOtp } from '../controllers/verifyOtp.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// OTP Login Routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email phone isAdmin googleId avatar provider createdAt updatedAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
});

/* ------------------------------------------
   GOOGLE OAUTH 2.0 FIXED CONFIGURATION
   COMMENTED OUT: Google OAuth routes - uncomment if needed in future
--------------------------------------------- */

// COMMENTED OUT: Google OAuth routes - uncomment if needed in future
/*
// FRONTEND that user should be redirected to AFTER login  
// (Production + Local supported)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// JWT used by Google login
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// 🔹 Step 1: Google Login (Triggers Google Consent Screen)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// 🔹 Step 2: Google Callback (this MUST match GOOGLE_CALLBACK_URL)
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/auth/failure`,
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Create JWT token
      const token = jwt.sign(
        { id: String(user._id), email: user.email, isAdmin: !!user.isAdmin },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Environment-based cookie behavior
      const isProd =
        process.env.NODE_ENV === 'production' ||
        (process.env.BACKEND_URL || '').startsWith('https://');

      // Set Cookie for authentication
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // 🔥 FINAL REDIRECT AFTER SUCCESSFUL GOOGLE LOGIN
      // Sends the user to frontend with success page
      return res.redirect(`${FRONTEND_URL}/auth/success`);
    } catch (e) {
      console.error("Google login error:", e);
      return res.redirect(`${FRONTEND_URL}/auth/failure`);
    }
  }
);
*/

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  return res.json({ message: 'Logged out' });
});

export default router;
