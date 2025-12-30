import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getProductImage, placeholders } from '../utils/imagePlaceholder';

function Cart() {
  const navigate = useNavigate();
  const { 
    cart = [], 
    updateQuantity, 
    removeFromCart, 
    cartTotal = 0, 
    cartCount = 0,
    clearCart 
  } = useCart();

  console.log('Cart component rendered with:', { cart, cartTotal, cartCount }); // Debug log

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuantityChange = (itemId, newQuantity, size = null) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size);
    } else {
      updateQuantity(itemId, newQuantity, size);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-teal-600 hover:text-teal-700 mb-4 sm:mb-6 transition-all cursor-pointer border-2 border-teal-600 rounded-lg px-3 sm:px-5 py-2 sm:py-2.5 hover:bg-teal-600 hover:text-white font-semibold text-sm sm:text-base shadow-sm transform hover:scale-105 active:scale-95"
        >
          <FaArrowLeft className="mr-2" /> Continue Shopping
        </button>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
          <span className="w-1 h-6 sm:h-8 lg:h-10 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></span>
          <span className="break-words">Your Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
        </h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-8 sm:py-12 lg:py-16 bg-white rounded-2xl shadow-lg border border-teal-100 px-4">
          <FaShoppingCart className="mx-auto text-4xl sm:text-5xl lg:text-6xl text-teal-300 mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-2">Looks like you haven't added anything to your cart yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-semibold shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 border-2 border-teal-100 hover:border-teal-300 transition-all hover:shadow-lg">
                <div className="w-full sm:w-24 lg:w-28 h-24 sm:h-24 lg:h-28 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer border-2 border-teal-100 hover:border-teal-400 transition-all flex-shrink-0">
                  <img
                    src={getProductImage({ images: { image1: item.image } }, 'image1') || placeholders.product}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onClick={() => navigate(`/product/${item.id}`)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = placeholders.product;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <h3 
                    className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 cursor-pointer hover:text-teal-600 transition-colors mb-2 break-words line-clamp-2"
                    onClick={() => navigate(`/product/${item.id}`)}
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                  {item.size && (
                    <p className="text-teal-700 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 break-words">Size: {item.size}</p>
                  )}
                  {(item.material || item.work) && (
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 break-words line-clamp-2">
                      {item.material && item.work ? `${item.material} with ${item.work}` : item.material || item.work}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <div className="flex items-center border-2 border-teal-300 rounded-lg overflow-hidden shadow-sm">
                      <button 
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1, item.size)}
                        className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold cursor-pointer transition-colors"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 border-x-2 border-teal-300 bg-white text-gray-900 font-semibold text-sm sm:text-base">{item.quantity || 1}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1, item.size)}
                        className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold cursor-pointer transition-colors"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id, item.size || null)}
                      className="text-red-500 hover:text-red-700 flex items-center cursor-pointer font-medium transition-colors hover:bg-red-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                    >
                      <FaTrash className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto text-left sm:text-right flex-shrink-0 sm:ml-4">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-teal-700">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                  {item.originalPrice > item.price && (
                    <p className="text-xs sm:text-sm text-gray-500 line-through mt-1">₹{item.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 lg:p-6 border-2 border-teal-200 bg-gradient-to-br from-white to-teal-50/30">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></span>
                <span className="break-words">Order Summary</span>
              </h2>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center py-2 border-b border-teal-100">
                  <span className="text-gray-700 font-medium text-sm sm:text-base break-words pr-2">Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base flex-shrink-0">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-teal-100">
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Shipping</span>
                  <span className={`text-sm sm:text-base flex-shrink-0 ${cartTotal >= 1000 ? "text-teal-600 font-bold" : "text-gray-700 font-semibold"}`}>
                    {cartTotal >= 1000 ? 'Free ✓' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-teal-100">
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Tax (5%)</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base flex-shrink-0">₹{Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-teal-300 my-2 sm:my-3"></div>
                <div className="flex justify-between items-center text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-50 to-cyan-50 p-3 sm:p-4 rounded-lg border border-teal-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-teal-700 flex-shrink-0">₹{(cartTotal + (cartTotal >= 1000 ? 0 : 99) + Math.round(cartTotal * 0.05)).toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout/address')}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 sm:py-4 px-4 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-bold shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer text-base sm:text-lg"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={clearCart}
                className="w-full mt-3 sm:mt-4 text-teal-600 border-2 border-teal-600 py-2.5 sm:py-3 px-4 rounded-xl hover:bg-teal-600 hover:text-white transition-all font-semibold cursor-pointer transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                Clear Cart
              </button>
              
              <p className="text-xs text-gray-500 mt-4 sm:mt-6 text-center leading-relaxed px-2">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Cart;
