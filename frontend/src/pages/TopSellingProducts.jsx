import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { CATEGORIES } from '../constants/categories';
import { placeholders, getProductImage } from '../utils/imagePlaceholder';
import { FaRupeeSign, FaSpinner } from 'react-icons/fa';

const TopSellingProducts = () => {
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsByCategory = {};

        // Fetch products for each category
        for (const category of CATEGORIES) {
          try {
            // Extract category name from path or use the name directly
            const categoryName = category.name;
            const products = await fetchProducts(categoryName, null);
            
            // Sort by discountPercent (higher discount = top selling) or by price
            // Take top 6 products per category
            const topProducts = products
              .sort((a, b) => {
                // Sort by discountPercent descending, then by price ascending
                const discountA = a.discountPercent || 0;
                const discountB = b.discountPercent || 0;
                if (discountB !== discountA) return discountB - discountA;
                const priceA = a.price || a.mrp || 0;
                const priceB = b.price || b.mrp || 0;
                return priceA - priceB;
              })
              .slice(0, 6);

            productsByCategory[categoryName] = topProducts;
          } catch (err) {
            console.error(`Error loading products for ${category.name}:`, err);
            productsByCategory[category.name] = [];
          }
        }

        setCategoryProducts(productsByCategory);
      } catch (err) {
        console.error('Error loading top selling products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const calculatePrice = (product) => {
    if (product.price !== undefined) return product.price;
    const mrp = product.mrp || 0;
    const discount = product.discountPercent || 0;
    return Math.round(mrp - (mrp * discount) / 100);
  };

  const CategorySection = ({ category }) => {
    const products = categoryProducts[category.name] || [];
    
    if (products.length === 0 && !loading) return null;

    return (
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300/80 to-teal-400/60 min-w-[40px]" aria-hidden />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 uppercase tracking-tight">
                {category.name}
              </h2>
              <span className="flex-1 h-px bg-gradient-to-l from-transparent via-teal-300/80 to-teal-400/60 min-w-[40px]" aria-hidden />
            </div>
            <p className="text-center text-sm sm:text-base text-gray-600 mt-2">
              Top Selling Products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No products available in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {products.map((product) => {
                const finalPrice = calculatePrice(product);
                const imageUrl = product?.images?.image1 || getProductImage(product?.title || '');
                
                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={product.title || 'Product'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = placeholders.product;
                        }}
                      />
                      {product.discountPercent > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                          {product.discountPercent}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                        {product.title || 'Untitled Product'}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                          <FaRupeeSign className="w-3 h-3" />
                          {finalPrice.toLocaleString('en-IN')}
                        </span>
                        {product.mrp && product.mrp > finalPrice && (
                          <>
                            <span className="text-xs sm:text-sm text-gray-500 line-through flex items-center">
                              <FaRupeeSign className="w-2.5 h-2.5" />
                              {product.mrp.toLocaleString('en-IN')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Button */}
          {products.length > 0 && (
            <div className="mt-6 md:mt-8 text-center">
              <button
                onClick={() => navigate(category.path)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
              >
                View All {category.name}
                <span className="text-lg">→</span>
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight">
            Top Selling Products
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-2xl mx-auto">
            Discover our best-selling products across all categories
          </p>
        </div>
      </div>

      {/* Category Sections */}
      <div className="divide-y divide-gray-200">
        {CATEGORIES.map((category, idx) => (
          <CategorySection key={category.name} category={category} />
        ))}
      </div>

      {/* Loading State for entire page */}
      {loading && categoryProducts && Object.keys(categoryProducts).length === 0 && (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="w-12 h-12 text-teal-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
