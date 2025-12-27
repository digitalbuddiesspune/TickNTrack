import Razorpay from 'razorpay';
import crypto from 'crypto';
import axios from 'axios';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { Address } from '../models/Address.js';
import { generateHash } from '../utils/generateHash.js';

const getClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!key_id || !key_secret) return null;
  return { client: new Razorpay({ key_id, key_secret }), key_id, key_secret };
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || Number.isNaN(rupees) || rupees <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Razorpay keys not configured on server' });
    }

    const options = {
      amount: Math.round(rupees * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    };

    const order = await ctx.client.orders.create(options);
    return res.json({ order, key: ctx.key_id });
  } catch (err) {
    console.error('Razorpay createOrder error:', err?.message || err);
    if (err?.error?.description) console.error('Razorpay API:', err.error.description);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Server secret missing' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', ctx.key_secret).update(payload).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = cart.items.map(i => {
      const p = i.product;
      let base = 0;
      if (p && typeof p.price === 'number') {
        base = Number(p.price) || 0;
      } else {
        const mrp = Number(p?.mrp) || 0;
        const discountPercent = Number(p?.discountPercent) || 0;
        base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
      }
      return { 
        product: p._id, 
        quantity: i.quantity, 
        price: base,
        size: i.size || undefined // Include size if available
      };
    });
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch {}

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'paid',
      paymentMethod: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    return res.json({ success: true, order });
  } catch (err) {
    console.error('Razorpay verifyPayment error:', err?.message || err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};

export const createCODOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Filter out invalid products and map to order items
    const items = cart.items
      .filter(i => {
        const p = i.product;
        if (!p || !p._id) {
          console.warn('Skipping invalid product in cart:', i);
          return false;
        }
        return true;
      })
      .map(i => {
        const p = i.product;
        let base = 0;
        if (p && typeof p.price === 'number') {
          base = Number(p.price) || 0;
        } else {
          const mrp = Number(p?.mrp) || 0;
          const discountPercent = Number(p?.discountPercent) || 0;
          base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
        }
        return { 
          product: p._id, 
          quantity: i.quantity || 1, 
          price: base,
          size: i.size || undefined
        };
      });

    // Check if we have any valid items after filtering
    if (items.length === 0) {
      return res.status(400).json({ error: 'No valid products in cart' });
    }

    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch (addrErr) {
      console.error('Error loading address:', addrErr);
    }

    const orderData = {
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'cod',
    };

    if (shippingAddress) {
      orderData.shippingAddress = shippingAddress;
    }

    console.log('Creating COD order with data:', JSON.stringify(orderData, null, 2));
    
    const order = await Order.create(orderData);
    console.log('COD order created successfully:', order._id);

    cart.items = [];
    await cart.save();
    console.log('Cart cleared after COD order');

    return res.json({ success: true, order });
  } catch (err) {
    console.error('COD order creation error:', err?.message || err);
    console.error('Error stack:', err?.stack);
    console.error('Error name:', err?.name);
    if (err.errors) {
      console.error('Validation errors:', JSON.stringify(err.errors, null, 2));
    }
    return res.status(500).json({ 
      error: 'Failed to create COD order',
      message: err?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? {
        message: err?.message,
        name: err?.name,
        errors: err?.errors
      } : undefined
    });
  }
};

// ============================================
// PAYMENT GATEWAY INTEGRATION
// ============================================

/**
 * Verify payment status with Payment Gateway (mandatory)
 * Protects from browser tampering
 */
export const verifyPaymentStatus = async (orderId) => {
  try {
    const payload = {
      api_key: process.env.PG_API_KEY,
      order_id: orderId
    };

    payload.hash = generateHash(payload, process.env.PG_SALT);

    const response = await axios.post(
      `${process.env.PG_API_URL}/v2/paymentstatus`,
      payload
    );

    return response.data;
  } catch (err) {
    console.error('Payment status verification error:', err?.message || err);
    throw err;
  }
};

/**
 * Create payment request with Payment Gateway
 * POST /api/payment/create
 */
export const createPayment = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Get cart items
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate amount
    const items = cart.items.map(i => {
      const p = i.product;
      let base = 0;
      if (p && typeof p.price === 'number') {
        base = Number(p.price) || 0;
      } else {
        const mrp = Number(p?.mrp) || 0;
        const discountPercent = Number(p?.discountPercent) || 0;
        base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
      }
      return { 
        product: p._id, 
        quantity: i.quantity, 
        price: base,
        size: i.size || undefined
      };
    });
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Get user details
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get shipping address
    let shippingAddress = null;
    let addressData = {};
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
        addressData = {
          name: fullName || user.name || 'Customer',
          phone: mobileNumber || user.phone || '',
          city: city || 'Pune',
          zip_code: pincode || '411001',
        };
      }
    } catch {}

    // Generate order ID
    const orderId = `ORD_${Date.now()}_${userId}`;

    // Build payment payload
    const payload = {
      api_key: process.env.PG_API_KEY,
      order_id: orderId,
      amount: amount.toString(),
      currency: 'INR',
      description: 'Order Payment',
      name: addressData.name || user.name || 'Customer',
      email: user.email || '',
      phone: addressData.phone || user.phone || '',
      city: addressData.city || 'Pune',
      country: 'IND',
      zip_code: addressData.zip_code || '411001',
      return_url: `${process.env.BACKEND_URL}/api/payment/success`,
      return_url_failure: `${process.env.BACKEND_URL}/api/payment/failure`,
      mode: process.env.PG_MODE || 'LIVE'
    };

    // Generate hash
    payload.hash = generateHash(payload, process.env.PG_SALT);

    // Create payment request
    const response = await axios.post(
      `${process.env.PG_API_URL}/v2/paymentrequest`,
      payload,
      {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
      }
    );

    // Get redirect URL from response
    const redirectUrl = response.request?.res?.responseUrl || response.data?.redirect_url || response.headers?.location;

    if (!redirectUrl) {
      console.error('Payment Gateway response:', response.data);
      return res.status(500).json({ error: 'Failed to get payment redirect URL' });
    }

    // Create order record with status 'created' (will be updated after payment verification)
    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'created',
      paymentMethod: 'paymentgateway',
      pgOrderId: orderId,
      shippingAddress,
    });

    return res.json({
      redirectUrl,
      orderId: order._id,
      pgOrderId: orderId
    });
  } catch (err) {
    console.error('Payment creation error:', err?.message || err);
    if (err.response) {
      console.error('Payment Gateway API error:', err.response.data);
    }
    return res.status(500).json({ 
      error: 'Failed to create payment',
      message: err?.message || 'Unknown error'
    });
  }
};

/**
 * Handle payment success callback
 * POST /api/payment/success
 */
export const paymentSuccess = async (req, res) => {
  try {
    const data = { ...req.body };
    const receivedHash = data.hash;
    delete data.hash;

    // Verify hash
    const calculatedHash = generateHash(data, process.env.PG_SALT);

    if (receivedHash !== calculatedHash) {
      console.error('Hash mismatch in payment success');
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=hash_mismatch`);
    }

    const orderId = data.order_id;
    if (!orderId) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=missing_order_id`);
    }

    // Verify payment status with Payment Gateway (mandatory)
    let statusData;
    try {
      statusData = await verifyPaymentStatus(orderId);
    } catch (statusErr) {
      console.error('Payment status verification failed:', statusErr?.message || statusErr);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=verification_failed`);
    }

    // Find order by PG order ID
    const order = await Order.findOne({ pgOrderId: orderId });
    if (!order) {
      console.error('Order not found for PG order ID:', orderId);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=order_not_found`);
    }

    // Check payment status from gateway response
    const paymentStatus = statusData.status || statusData.response_code;
    const isSuccess = paymentStatus === 'success' || paymentStatus === 'SUCCESS' || statusData.response_code === '00';

    if (isSuccess) {
      // Update order status
      order.status = 'paid';
      order.pgTransactionId = statusData.transaction_id || data.transaction_id;
      order.pgResponseCode = statusData.response_code;
      order.pgRawResponse = JSON.stringify(statusData);
      await order.save();

      // Clear cart
      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        cart.items = [];
        await cart.save();
      }

      return res.redirect(`${process.env.FRONTEND_URL}/order/success?orderId=${order._id}&paymentMethod=paymentgateway`);
    } else {
      // Payment failed
      order.status = 'failed';
      order.pgResponseCode = statusData.response_code || data.response_code;
      order.pgRawResponse = JSON.stringify(statusData);
      await order.save();

      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=payment_failed&orderId=${order._id}`);
    }
  } catch (err) {
    console.error('Payment success handler error:', err?.message || err);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=server_error`);
  }
};

/**
 * Handle payment failure callback
 * POST /api/payment/failure
 */
export const paymentFailure = async (req, res) => {
  try {
    const data = { ...req.body };
    const receivedHash = data.hash;
    delete data.hash;

    // Verify hash if provided
    if (receivedHash) {
      const calculatedHash = generateHash(data, process.env.PG_SALT);
      if (receivedHash !== calculatedHash) {
        console.error('Hash mismatch in payment failure');
      }
    }

    const orderId = data.order_id;
    if (orderId) {
      // Find and update order status
      const order = await Order.findOne({ pgOrderId: orderId });
      if (order && order.status === 'created') {
        order.status = 'failed';
        order.pgResponseCode = data.response_code;
        order.pgRawResponse = JSON.stringify(data);
        await order.save();
      }
    }

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=payment_failed${orderId ? `&orderId=${orderId}` : ''}`);
  } catch (err) {
    console.error('Payment failure handler error:', err?.message || err);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=server_error`);
  }
};