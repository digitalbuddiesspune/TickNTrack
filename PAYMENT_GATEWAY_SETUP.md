# Payment Gateway Integration Setup

This document describes the payment gateway integration that has been implemented in the TickNTrack application.

## Environment Variables Required

Add these to your `.env` file in the backend:

```env
# Payment Gateway Configuration
PG_API_URL=https://<gateway-base-url>
PG_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PG_SALT=xxxxxxxxxxxxxxxx
PG_MODE=LIVE  # or TEST for testing

# Frontend and Backend URLs
FRONTEND_URL=http://localhost:5173  # or your production frontend URL
BACKEND_URL=http://localhost:5000   # or your production backend URL
```

## Implementation Details

### Backend

1. **Hash Generation Utility** (`backend/utils/generateHash.js`)
   - Generates SHA-512 hash for payment requests
   - Sorts keys alphabetically and joins values with `|`
   - Appends salt before hashing

2. **Payment Controller** (`backend/controllers/payment.controller.js`)
   - `createPayment`: Creates payment request and redirects to gateway
   - `paymentSuccess`: Handles success callback from gateway
   - `paymentFailure`: Handles failure callback from gateway
   - `verifyPaymentStatus`: Verifies payment status with gateway API (mandatory)

3. **Payment Routes** (`backend/routes/payment.routes.js`)
   - `POST /api/payment/create`: Create payment request (requires auth)
   - `POST /api/payment/success`: Success callback (no auth - called by gateway)
   - `POST /api/payment/failure`: Failure callback (no auth - called by gateway)

4. **Order Model** (`backend/models/Order.js`)
   - Added `paymentgateway` to paymentMethod enum
   - Added fields: `pgOrderId`, `pgTransactionId`, `pgResponseCode`, `pgRawResponse`

### Frontend

1. **API Service** (`frontend/src/services/api.js`)
   - Added `createPaymentGatewayOrder()` function

2. **Address Page** (`frontend/src/pages/Address.jsx`)
   - Added payment gateway option to payment method selection
   - Integrated redirect to payment gateway on selection

## Payment Flow

1. User selects "Payment Gateway" as payment method
2. Frontend calls `POST /api/payment/create`
3. Backend:
   - Calculates order total from cart
   - Creates order record with status 'created'
   - Builds payment payload with hash
   - Calls payment gateway API
   - Returns redirect URL
4. User is redirected to payment gateway
5. After payment, gateway POSTs to `/api/payment/success` or `/api/payment/failure`
6. Backend:
   - Verifies hash
   - Calls payment status API (mandatory verification)
   - Updates order status (paid/failed)
   - Clears cart if successful
   - Redirects user to success/failure page

## Security Features

- ✅ Hash verification on all callbacks
- ✅ Payment status API verification (mandatory)
- ✅ All sensitive operations on backend only
- ✅ Order status tracking (created → paid/failed)

## Testing

1. Use TEST/UAT credentials first
2. Test complete payment flow end-to-end
3. Verify order status updates correctly
4. Test payment failure scenarios
5. Verify cart is cleared after successful payment

## Notes

- Payment gateway callbacks do NOT require authentication (they're called by the gateway)
- Always verify payment status via API before marking order as paid
- Save raw gateway response for debugging and reconciliation
- Hash mismatch or verification failure redirects to failure page

