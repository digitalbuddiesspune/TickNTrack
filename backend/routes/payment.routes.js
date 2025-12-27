import { Router } from 'express';
import { 
  createOrder, 
  verifyPayment, 
  createCODOrder,
  createPayment,
  paymentSuccess,
  paymentFailure
} from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

// Razorpay routes (existing)
router.post('/orders', createOrder);
router.post('/verify', auth, verifyPayment);
router.post('/cod', auth, createCODOrder);

// Payment Gateway routes (new)
router.post('/create', auth, createPayment);
// Payment gateway callbacks - called by gateway (no auth required)
// Note: Gateway sends form data, but express.json() middleware should handle both
router.post('/success', paymentSuccess);
router.post('/failure', paymentFailure);

export default router;
