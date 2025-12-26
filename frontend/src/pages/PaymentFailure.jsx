import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaHome, FaRedo } from 'react-icons/fa';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getErrorMessage = () => {
    switch (error) {
      case 'hash_mismatch':
        return 'Payment verification failed. Please contact support.';
      case 'missing_order_id':
        return 'Order information missing. Please try again.';
      case 'order_not_found':
        return 'Order not found. Please contact support.';
      case 'verification_failed':
        return 'Payment verification failed. Please try again.';
      case 'payment_failed':
        return 'Your payment could not be processed. Please try again.';
      case 'server_error':
        return 'An error occurred while processing your payment. Please try again.';
      default:
        return 'Your payment could not be completed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 overflow-hidden">
          {/* Failure Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaTimesCircle className="text-6xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Payment Failed</h1>
            <p className="text-red-100 text-lg">
              {getErrorMessage()}
            </p>
          </div>

          {/* Error Details */}
          <div className="p-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaTimesCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Payment could not be processed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Your payment could not be completed. This could be due to:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Insufficient funds in your account</li>
                      <li>Card details entered incorrectly</li>
                      <li>Network connectivity issues</li>
                      <li>Bank declined the transaction</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {orderId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Order ID:</span> {orderId}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Please save this order ID for reference
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/checkout/address')}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <FaRedo className="text-lg" />
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-white text-red-600 border-2 border-red-600 py-4 px-6 rounded-xl hover:bg-red-50 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <FaHome className="text-lg" />
                Go to Home
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                If you continue to face issues, please contact our support team
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Your money is safe and will be refunded if debited
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

