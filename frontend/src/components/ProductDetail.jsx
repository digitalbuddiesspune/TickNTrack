import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaRupeeSign, FaArrowLeft, FaStar, FaRegStar, FaBolt, FaSpinner, FaTimes, FaExpand, FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { fetchProductById, fetchProducts, getWishlist, addToWishlist, removeFromWishlist } from "../services/api";
import { placeholders, getProductImage } from "../utils/imagePlaceholder";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const location = useLocation();
  const [wishlisted, setWishlisted] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Initialize wishlist state when product loads
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product) return;
      const pid = product._id || id;
      try {
        const data = await getWishlist();
        const productIds = (data.items || []).map(item => item.product?._id || item.product).filter(Boolean);
        setWishlisted(productIds.includes(pid));
      } catch (err) {
        // If not authenticated or error, treat as not wishlisted
        setWishlisted(false);
      }
    };
    checkWishlistStatus();
  }, [product, id]);

  // Fetch related products based on category
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product || !product.category) return;
      
      try {
        setLoadingRelated(true);
        const category = product.category;
        const allProducts = await fetchProducts(category);
        
        // Filter out current product and limit to 8 products
        const related = allProducts
          .filter(p => p._id !== product._id)
          .slice(0, 8);
        
        setRelatedProducts(related);
      } catch (err) {
        console.error('Failed to load related products:', err);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    loadRelatedProducts();
  }, [product]);

  // Handle scroll to hide/show buttons
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if footer is in view
      const footer = document.querySelector('footer');
      let isFooterVisible = false;
      
      if (footer) {
        const footerTop = footer.offsetTop;
        const scrollPosition = window.scrollY + windowHeight;
        
        // Check if footer is visible in viewport (with 150px threshold)
        isFooterVisible = scrollPosition >= footerTop - 150;
      }
      
      // Hide buttons if:
      // 1. Scrolling down (currentScrollY > lastScrollY) AND scrolled more than 100px
      // 2. Footer is visible
      // 3. Near bottom of page
      const isScrollingDown = currentScrollY > lastScrollY && currentScrollY > 100;
      const isNearBottom = currentScrollY + windowHeight >= documentHeight - 200;
      
      if (isScrollingDown || isFooterVisible || isNearBottom) {
        setShowButtons(false);
      } else if (currentScrollY < lastScrollY) {
        // Show buttons when scrolling up (unless footer is visible)
        if (!isFooterVisible) {
          setShowButtons(true);
        }
      }
      
      // Always show buttons at the top
      if (currentScrollY < 50) {
        setShowButtons(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if product requires size selection
    const availableSizes = product.product_info?.availableSizes || 
      (product.product_info?.shoeSize ? [product.product_info.shoeSize] : []);
    const isShoe = product.category && (
      product.category.toLowerCase().includes('shoe') || 
      product.category.toLowerCase().includes('sneaker') ||
      product.category.toLowerCase().includes('boot') ||
      product.category.toLowerCase().includes('sandal')
    );
    
    // Require size selection if it's a shoe or has available sizes
    if ((isShoe || availableSizes.length > 0) && availableSizes.length > 0 && !selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }
    
    setIsAdding(true);
    try {
      await addToCart(id, quantity, selectedSize);
      alert(`${product.title} ${quantity > 1 ? `(${quantity} items) ` : ''}added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: product?.title || 'Product',
        text: product?.description?.slice(0, 120) || 'Check out this product!',
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
      }
    } catch (e) {
      console.error('Share failed', e);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gradient-to-b from-teal-50 to-white min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 bg-gradient-to-b from-teal-50 to-white min-h-screen">
        <p className="text-gray-600">Product not found</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-md"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const sellingPrice = Math.round(product.mrp - (product.mrp * (product.discountPercent || 0) / 100));

  return (
    <>
      {/* Image Modal - Rendered using Portal to ensure it's above header */}
      {isImageModalOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              <FaTimes className="w-8 h-8" />
            </button>
            <img
              src={getProductImage(product, 'image1')}
              alt={product.title}
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholders.productDetail;
              }}
            />
          </div>
        </div>,
        document.body
      )}

    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-gray-50 pb-20 sm:pb-4 relative">

      <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          
          {/* Image Section */}
          <div className="w-full overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-gray-50 group relative border border-teal-100">
            <div className="relative pt-[100%] md:pt-[90%] overflow-hidden">
              <img
                src={getProductImage(product, 'image1')}
                alt={product.title}
                className="absolute top-0 left-0 w-full h-full object-contain cursor-zoom-in"
                onClick={() => setIsImageModalOpen(true)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholders.productDetail;
                }}
              />
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className={(wishlisted
                    ? 'bg-red-600 text-white hover:bg-red-700 border border-red-600'
                    : 'bg-white text-red-600 hover:bg-red-50 border border-red-300') + ' rounded-full p-2 shadow-md cursor-pointer transition-all'}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!product) return;
                    const pid = product._id || id;
                    
                    try {
                      if (wishlisted) {
                        // Remove from wishlist
                        await removeFromWishlist(pid);
                        setWishlisted(false);
                        try { window.dispatchEvent(new Event('wishlist:updated')); } catch {}
                      } else {
                        // Add to wishlist
                        await addToWishlist(pid);
                        setWishlisted(true);
                        try { window.dispatchEvent(new Event('wishlist:updated')); } catch {}
                        alert(`${product.title} added to wishlist`);
                      }
                    } catch (err) {
                      console.error('Error toggling wishlist:', err);
                      if (err.message && err.message.includes('login')) {
                        alert('Please login to add items to wishlist');
                        navigate('/signin');
                      } else {
                        alert('Failed to update wishlist. Please try again.');
                      }
                    }
                  }}
                  title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlisted ? <FaHeart className="fill-current" /> : <FaRegHeart />}
                </button>
                <button
                  type="button"
                  aria-label="Share"
                  className="bg-white/90 hover:bg-white text-teal-700 hover:text-teal-900 rounded-full p-2 shadow-md cursor-pointer transition-all"
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  title="Share"
                >
                  <FaShareAlt />
                </button>
              </div>
              <div 
                className="absolute bottom-4 right-4 bg-teal-600 bg-opacity-90 text-white p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageModalOpen(true);
                }}
                title="Click to enlarge"
              >
                <FaExpand className="text-white" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="py-4 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-teal-500 mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= 4 ? <FaStar key={star} /> : <FaRegStar key={star} />
                ))}
              </div>
              <span className="text-gray-600 text-sm font-medium">(24 Reviews)</span>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <FaRupeeSign className="text-teal-600" />
                <span className="text-3xl font-bold text-teal-700 ml-1">
                  {sellingPrice.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-400 text-lg line-through ml-4">
                ₹{product.mrp.toLocaleString()}
              </span>
              {product.discountPercent > 0 && (
                <span className="bg-teal-100 text-teal-700 text-sm font-bold px-3 py-1 rounded-lg ml-4 shadow-sm">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></span>
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6 bg-teal-50 p-4 rounded-lg border border-teal-100">
                {product.description}
              </p>

              {/* Size Selector for Shoes */}
              {(() => {
                const categoryLower = (product.category || '').toLowerCase();
                const isShoe = categoryLower.includes('shoe') || 
                              categoryLower.includes('sneaker') ||
                              categoryLower.includes('boot') ||
                              categoryLower.includes('sandal') ||
                              categoryLower.includes('heel') ||
                              categoryLower.includes('flat');
                
                // Get available sizes from product_info
                let availableSizes = product.product_info?.availableSizes || [];
                
                // If it's a shoe but no sizes defined, provide default sizes
                if (isShoe && availableSizes.length === 0) {
                  // Default sizes for shoes (Indian sizes)
                  availableSizes = ['5', '6', '7', '8', '9', '10', '11'];
                } else if (product.product_info?.shoeSize && availableSizes.length === 0) {
                  // Legacy support: if only shoeSize exists, use it
                  availableSizes = [product.product_info.shoeSize];
                }
                
                // Show size selector if it's a shoe OR if product has availableSizes
                if (isShoe && availableSizes.length > 0) {
                  return (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></span>
                        Select Size
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 min-w-[60px] ${
                              selectedSize === size
                                ? 'bg-teal-600 text-white shadow-lg border-2 border-teal-700 scale-105'
                                : 'bg-white text-teal-700 border-2 border-teal-300 hover:bg-teal-50 hover:border-teal-500'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {!selectedSize && (
                        <p className="text-red-500 text-sm mt-3 font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Please select a size before adding to cart
                        </p>
                      )}
                      {selectedSize && (
                        <p className="text-teal-600 text-sm mt-2 font-medium">
                          ✓ Selected Size: <span className="font-bold">{selectedSize}</span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Quantity Selector and Action Buttons */}
              <div className="flex items-center mb-6">
                <span className="text-gray-800 font-semibold mr-4">Quantity:</span>
                <div className="flex items-center border-2 border-teal-300 rounded-lg overflow-hidden shadow-sm">
                  <button 
                    onClick={decrementQuantity}
                    className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x-2 border-teal-300 bg-white text-gray-900 font-semibold">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Sticky Buttons Container - Hidden on larger screens */}
              <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-teal-100 p-3 z-50 sm:hidden transition-transform duration-300 ${
                showButtons ? 'translate-y-0' : 'translate-y-full'
              }`}>
                <div className="flex gap-3 max-w-md mx-auto">
                  <button 
                    className="flex-1 bg-white text-teal-600 py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-teal-600 hover:text-white transition-all disabled:opacity-70 cursor-pointer shadow-md border-2 border-teal-600 font-semibold text-sm transform hover:scale-105 active:scale-95"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                  >
                    <FaShoppingCart className="h-4 w-4" />
                    <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                  </button>
                  <button 
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:from-teal-700 hover:to-cyan-700 transition-all cursor-pointer shadow-lg font-semibold text-sm transform hover:scale-105 active:scale-95"
                    onClick={handleBuyNow}
                  >
                    <FaBolt className="h-4 w-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* Regular Buttons - Hidden on mobile */}
              <div className="hidden sm:flex flex-col sm:flex-row gap-4 mb-6">
                <button 
                  className="flex-1 bg-white text-teal-600 py-3 px-6 rounded-xl flex items-center justify-center space-x-2 hover:bg-teal-600 hover:text-white transition-all disabled:opacity-70 cursor-pointer shadow-md border-2 border-teal-600 font-semibold transform hover:scale-105 active:scale-95"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <FaShoppingCart className="h-5 w-5" />
                  <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                <button 
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 hover:from-teal-700 hover:to-cyan-700 transition-all cursor-pointer shadow-lg font-semibold transform hover:scale-105 active:scale-95"
                  onClick={handleBuyNow}
                >
                  <FaBolt className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>
              </div>
              
              <div className="space-y-4 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                <h4 className="text-xl font-bold text-gray-900 border-b-2 border-teal-300 pb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></span>
                  Product Information
                </h4>
                <div className="space-y-4 text-gray-800">
                  <div className="flex items-center py-2 border-b border-teal-100">
                    <span className="w-40 font-semibold text-teal-700">Brand:</span>
                    <span className="font-medium">{product.product_info?.brand || 'N/A'}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-teal-100">
                    <span className="w-40 font-semibold text-teal-700">Manufacturer:</span>
                    <span className="font-medium">{product.product_info?.manufacturer || 'N/A'}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-teal-100">
                    <span className="w-40 font-semibold text-teal-700">Category:</span>
                    <span className="font-medium bg-teal-100 text-teal-800 px-3 py-1 rounded-lg inline-block">{product.category}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-teal-100">
                    <span className="w-40 font-semibold text-teal-700">Material:</span>
                    <span className="font-medium">{product.product_info?.SareeMaterial || product.product_info?.shoeMaterial || product.product_info?.material || 'N/A'}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-teal-100">
                    <span className="w-40 font-semibold text-teal-700">Color:</span>
                    <span className="font-medium">{product.product_info?.SareeColor || product.product_info?.shoeColor || product.product_info?.color || 'N/A'}</span>
                  </div>
                  {product.product_info?.SareeLength && (
                    <div className="flex items-center py-2 border-b border-teal-100">
                      <span className="w-40 font-semibold text-teal-700">Length:</span>
                      <span className="font-medium">{product.product_info.SareeLength}</span>
                    </div>
                  )}
                  {product.product_info?.availableSizes && product.product_info.availableSizes.length > 0 && (
                    <div className="flex items-center py-2 border-b border-teal-100">
                      <span className="w-40 font-semibold text-teal-700">Available Sizes:</span>
                      <span className="font-medium">{product.product_info.availableSizes.join(', ')}</span>
                    </div>
                  )}
                  {product.product_info?.shoeType && (
                    <div className="flex items-center py-2 border-b border-teal-100">
                      <span className="w-40 font-semibold text-teal-700">Type:</span>
                      <span className="font-medium">{product.product_info.shoeType}</span>
                    </div>
                  )}
                  {product.product_info?.IncludedComponents && (
                    <div className="flex items-center py-2">
                      <span className="w-40 font-semibold text-teal-700">Included:</span>
                      <span className="font-medium">{product.product_info.IncludedComponents}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="mt-8 pt-6 border-t-2 border-teal-200">
              <div className="flex items-center bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200">
                <div className="bg-teal-600 p-3 rounded-full mr-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold">Free shipping on orders over ₹1,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></span>
              Related Products
            </h2>
            
            {loadingRelated ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-4xl text-teal-600" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((product) => {
                  const productPrice = Math.round(product.mrp - (product.mrp * (product.discountPercent || 0) / 100));
                  return (
                    <div
                      key={product._id}
                      className="group bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-teal-300"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                        <img
                          src={getProductImage(product, 'image1')}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholders.productList;
                          }}
                        />
                        {product.discountPercent > 0 && (
                          <span className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                            {product.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaRupeeSign className="text-teal-600 text-sm" />
                            <span className="text-lg font-bold text-teal-700 ml-1">
                              {productPrice.toLocaleString()}
                            </span>
                          </div>
                          {product.mrp > productPrice && (
                            <span className="text-gray-400 text-sm line-through">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ProductDetail;
