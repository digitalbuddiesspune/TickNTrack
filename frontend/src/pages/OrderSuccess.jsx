import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome, FaList } from 'react-icons/fa';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentMethod = searchParams.get('paymentMethod') || 'razorpay';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-teal-200 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaCheckCircle className="text-6xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-teal-100 text-lg">
              {paymentMethod === 'cod' 
                ? 'Your order has been confirmed. You will pay cash on delivery.'
                : 'Thank you for your purchase. Your payment has been received.'}
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 border border-teal-100">
              <div className="flex items-center gap-3 mb-4">
                <FaShoppingBag className="text-teal-600 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              </div>
              
              {orderId && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-teal-200">
                    <span className="text-gray-700 font-medium">Order ID:</span>
                    <span className="font-bold text-teal-700">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-teal-200">
                    <span className="text-gray-700 font-medium">Payment Method:</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {paymentMethod === 'cod' ? 'Pending' : 'Paid'}
                    </span>
                  </div>
                </div>
              )}

              {!orderId && (
                <p className="text-gray-600 text-center py-4">
                  Your order has been placed successfully!
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {paymentMethod === 'cod' 
                      ? 'You will receive a confirmation email shortly. Our team will contact you to confirm your order details.'
                      : 'You will receive an order confirmation email with all the details. We will start processing your order right away.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/profile?tab=orders')}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <FaList className="text-lg" />
                View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-white text-teal-600 border-2 border-teal-600 py-4 px-6 rounded-xl hover:bg-teal-50 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <FaHome className="text-lg" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;




