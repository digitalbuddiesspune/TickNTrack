import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, TrendingUp, Zap, ChevronRight, ShoppingBag, Award, Shield, Truck, Sparkles, ArrowRight, Clock, Search, User, Phone, Mail } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { CATEGORIES } from '../constants/categories';
import { placeholders, getProductImage } from '../utils/imagePlaceholder';

const TickNTrackSections = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(new Set());

  // Cache key for localStorage
  const CACHE_KEY = 'tickntrack_top_selling_products';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  // Load cached data on mount (skip if localStorage blocked e.g. Tracking Prevention)
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < CACHE_DURATION) {
          setCategoryProducts(data);
          return;
        }
        try { localStorage.removeItem(CACHE_KEY); } catch {}
      }
    } catch {
      // Cache read failed - will fetch below
    }
  }, []);

  // Load top selling products for each category - Progressive loading with cache
  useEffect(() => {
    const loadCategoryProducts = async (category) => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          if (now - timestamp < CACHE_DURATION && data?.[category.name]) {
            setCategoryProducts(prev => ({ ...prev, [category.name]: data[category.name] }));
            return;
          }
        }
      } catch {
        // Cache blocked or invalid - proceed to fetch
      }

      try {
        setLoadingCategories(prev => new Set(prev).add(category.name));
        
        const allProducts = [];
        
        // Try parent category name first (most common case)
        try {
          const parentProducts = await fetchProducts(category.name, null);
          if (parentProducts && Array.isArray(parentProducts) && parentProducts.length > 0) {
            allProducts.push(...parentProducts);
          }
        } catch (e) {
          // Try alternative format
          try {
            const altName = category.name.replace("'S", "'s");
            const altProducts = await fetchProducts(altName, null);
            if (altProducts && Array.isArray(altProducts) && altProducts.length > 0) {
              allProducts.push(...altProducts);
            }
          } catch (e2) {
            // Continue to subcategories
          }
        }
        
        // Fetch from first 2-3 subcategories only (to speed up)
        const subcategoriesToTry = (category.subcategories || []).slice(0, 3);
        for (const subcategory of subcategoriesToTry) {
          try {
            const subProducts = await fetchProducts(null, subcategory.name);
            if (subProducts && Array.isArray(subProducts) && subProducts.length > 0) {
              allProducts.push(...subProducts);
            }
          } catch (subErr) {
            // Try as category
            try {
              const subAsCat = await fetchProducts(subcategory.name, null);
              if (subAsCat && Array.isArray(subAsCat) && subAsCat.length > 0) {
                allProducts.push(...subAsCat);
              }
            } catch (e) {
              // Continue
            }
          }
        }
        
        // Remove duplicates by _id
        const uniqueProducts = Array.from(
          new Map(allProducts.map(p => [p._id || p.id, p])).values()
        );
        
        // Sort and take top 6
        const topProducts = uniqueProducts
          .sort((a, b) => {
            const discountA = a.discountPercent || 0;
            const discountB = b.discountPercent || 0;
            if (discountB !== discountA) return discountB - discountA;
            const priceA = a.price || a.mrp || 0;
            const priceB = b.price || b.mrp || 0;
            return priceA - priceB;
          })
          .slice(0, 6);

        // Update state immediately for this category (progressive loading)
        setCategoryProducts(prev => {
          const updated = {
            ...prev,
            [category.name]: topProducts
          };
          
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data: updated, timestamp: Date.now() }));
          } catch {
            // Cache write failed (e.g. blocked)
          }
          
          return updated;
        });
      } catch {
        setCategoryProducts(prev => ({
          ...prev,
          [category.name]: []
        }));
      } finally {
        setLoadingCategories(prev => {
          const next = new Set(prev);
          next.delete(category.name);
          return next;
        });
      }
    };

    // Load categories one by one with small delay to avoid overwhelming the server
    CATEGORIES.forEach((category, index) => {
      setTimeout(() => {
        loadCategoryProducts(category);
      }, index * 200); // 200ms delay between each category
    });
  }, []);

  // Premium Collection Categories
  const CollectionShowcase = () => {
    const collections = [
      {
        id: 1,
        title: "Athletic Performance",
        subtitle: "Professional Sport Collection",
        description: "Engineered for peak performance",
        items: "500+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022742/f8dbd04d-719c-431f-a21f-78b7a17d166c.png",
        gradient: "from-blue-600/95 via-indigo-700/95 to-purple-800/95",
        badge: "Performance Line",
        path: "/category/shoes/mens-shoes/Men-sports-shoes"
      },
      {
        id: 2,
        title: "Luxury Timepieces",
        subtitle: "Swiss Craftsmanship",
        description: "Precision meets elegance",
        items: "300+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022796/7486ac18-1754-45a3-863d-4a9e8b45d006.png",
        gradient: "from-amber-600/95 via-yellow-700/95 to-orange-800/95",
        badge: "Luxury Collection",
        path: "/category/watches/men-watches/Men-luxury-watches"
      },
      {
        id: 3,
        title: "Designer Footwear",
        subtitle: "Premium Women's Range",
        description: "Sophistication in every step",
        items: "650+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022843/7fccca1e-24b4-458a-80cd-5e245bcf37a2.png",
        gradient: "from-rose-600/95 via-pink-700/95 to-purple-800/95",
        badge: "Designer Series",
        path: "/category/shoes/womens-shoes"
      },
      {
        id: 4,
        title: "Urban Lifestyle",
        subtitle: "Contemporary Casual",
        description: "Style meets comfort",
        items: "400+",
        image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765022911/0451752d-41ef-40d2-b851-d9b9aff53885.png",
        gradient: "from-teal-600/95 via-cyan-700/95 to-blue-800/95",
        badge: "Lifestyle Collection",
        path: "/category/shoes/mens-shoes/Men-casual-shoes"
      }
    ];

    return (
      <section className="relative pt-8 md:pt-12 pb-8 md:pb-12 bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 overflow-hidden w-full">
        <div className="w-full px-4 sm:pl-2 sm:pr-6 lg:pl-6 lg:pr-8 xl:pl-4 xl:pr-4 2xl:pl-4 2xl:pr-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 rounded-full mb-3 md:mb-4">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-teal-600" />
              <span className="text-[10px] md:text-xs font-medium text-gray-700 uppercase tracking-wider">Curated Collections</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 mb-3 md:mb-4 tracking-tight px-2 uppercase">
              Premium Product Categories
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed px-2">
              Explore our carefully curated collections designed for discerning customers who value quality and style
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {collections.map((collection, idx) => (
              <div
                key={collection.id}
                onMouseEnter={() => setHoveredCard(`col-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative overflow-hidden rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[4/5] relative">
                  {/* Image */}
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} mix-blend-multiply`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start gap-1">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap">
                        {collection.badge}
                      </span>
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-[8px] sm:text-[10px] font-bold whitespace-nowrap">
                        {collection.items}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 tracking-tight">
                        {collection.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-medium text-white/90 mb-2 sm:mb-3 hidden sm:block">
                        {collection.subtitle}
                      </p>
                      
                      <button 
                        onClick={() => collection.path && navigate(collection.path)}
                        className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white text-gray-900 rounded-md text-[10px] sm:text-xs font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300 ${hoveredCard === `col-${idx}` ? 'translate-x-1' : ''}`}
                      >
                        Explore
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Category Grid Section
  const CategoryGrid = () => {
    const categoriesList = [
      { name: "Women Analog Watches", path: "/category/watches/Women-watches/Women-analog-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765215874/unnamed_vxpktl.jpg" },
      { name: "Men Caps", path: "/category/accessories/men-accessories/men-caps", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765627558/unnamed_frs0um.jpg" },
      { name: "Women Digital Watches", path: "/category/watches/Women-watches/Women-digital-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765215976/unnamed_whrlsk.jpg" },
      { name: "Women Goggles", path: "/category/accessories/women-accessories/women-goggles", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624604/unnamed_zqbgyk.jpg" },
      { name: "Men Luxury Watches", path: "/category/watches/men-watches/Men-luxury-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765217016/unnamed_g02sys.jpg" },
      { name: "Men Digital Watches", path: "/category/watches/men-watches/Men-digital-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216828/unnamed_o0mzpn.jpg" },
      { name: "Men Sunglasses", path: "/category/accessories/men-accessories/men-sunglasses", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765627303/unnamed_kjcjqf.jpg" },
      { name: "Women Smart Watches", path: "/category/watches/Women-watches/Women-smart-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216050/unnamed_ysaacr.jpg" },
      { name: "Men Smart Watches", path: "/category/watches/men-watches/Men-smart-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216850/unnamed_gjfozw.jpg" },
      { name: "Men Sports Watches", path: "/category/watches/men-watches/Men-sports-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216975/unnamed_nojuvl.jpg" },
      { name: "Women Fitness Trackers", path: "/category/watches/Women-watches/Women-fitness-trackers", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216223/unnamed_nmip79.jpg" },
      { name: "Women Classic Watches", path: "/category/watches/Women-watches/Women-classic-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216236/unnamed_o49ofl.jpg" },

      // Men Watches Subcategories
      { name: "Men Analog Watches", path: "/category/watches/men-watches/Men-analog-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216780/unnamed_v1mbbj.jpg" },
      { name: "Men Chronograph Watches", path: "/category/watches/men-watches/Men-chronograph-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765217016/unnamed_g02sys.jpg" },
      // Men's Shoes Subcategories
      { name: "Men Sports Shoes", path: "/category/shoes/mens-shoes/Men-sports-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765206732/unnamed_p3ovth.jpg" },
      { name: "Men Casual Shoes", path: "/category/shoes/mens-shoes/Men-casual-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765206928/ac0404c8-d323-4367-a2fa-d988b9bb642b.png" },
      { name: "Men Formal Shoes", path: "/category/shoes/mens-shoes/Men-formal-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207062/b3aae7be-8c69-4702-99ce-ceea80362b2f.png" },
      { name: "Men Sneakers", path: "/category/shoes/mens-shoes/Men-sneakers", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207177/unnamed_prumtn.jpg" },
      { name: "Men Boots", path: "/category/shoes/mens-shoes/Men-boots", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207208/unnamed_howyee.jpg" },
      { name: "Men Sandals", path: "/category/shoes/mens-shoes/Men-sandals", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207245/unnamed_chcwum.jpg" },
      
      // Women's Shoes Subcategories
      { name: "Women Heels", path: "/category/shoes/womens-shoes/Women-heels", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207254/unnamed_av2vv2.jpg" },
      { name: "Women Flats", path: "/category/shoes/womens-shoes/Women-flats", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207315/unnamed_hmoyfa.jpg" },
      { name: "Women Sneakers", path: "/category/shoes/womens-shoes/Women-sneakers", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207807/unnamed_ldee8d.jpg" },
      { name: "Women Sports Shoes", path: "/category/shoes/womens-shoes/Women-sports-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207816/unnamed_p7tedm.jpg" },
      { name: "Women Chappals", path: "/category/shoes/womens-shoes/Women-chappals", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207827/unnamed_gwgxpw.jpg" },
      { name: "Women Sandals", path: "/category/shoes/womens-shoes/Women-sandals", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207839/unnamed_otxqea.jpg" },
      
      // Women Accessories Subcategories
      { name: "Women Belts", path: "/category/accessories/women-accessories/women-belts", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624402/unnamed_wsvlka.jpg" },
      { name: "Women Sunglasses", path: "/category/accessories/women-accessories/women-sunglasses", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624740/unnamed_p4eskj.jpg" },
      
      // Men Accessories Subcategories
      { name: "Men Belts", path: "/category/accessories/men-accessories/men-belts", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765625319/unnamed_yb9rfg.jpg" },
      { name: "Women Handbags", path: "/category/accessories/women-accessories/women-handbags", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624892/unnamed_waspa8.jpg" },
      
    ];
    
    // Duplicate categories for seamless infinite scroll
    const categories = [...categoriesList, ...categoriesList, ...categoriesList];

    return (
      <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 w-full overflow-hidden">
        <div className="w-full px-4 sm:pl-2 sm:pr-6 lg:pl-6 lg:pr-8 xl:pl-4 xl:pr-4 2xl:pl-4 2xl:pr-6">
          {/* Two horizontal lines - left and right */}
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-300/80 to-teal-400/60 min-w-[40px]" aria-hidden />
            <span className="flex-shrink-0 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest">Categories</span>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent via-teal-300/80 to-teal-400/60 min-w-[40px]" aria-hidden />
          </div>

          {/* Auto-scrolling Category Carousel - optimized for smooth hover */}
          <div className="relative overflow-hidden pb-2 carousel-container" style={{ pointerEvents: 'none' }}>
            <style>{`
              @keyframes scroll-left {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(calc(-100% / 3), 0, 0); }
              }
              @keyframes scroll-right {
                0% { transform: translate3d(calc(-100% / 3), 0, 0); }
                100% { transform: translate3d(0, 0, 0); }
              }
              .scroll-left {
                animation: scroll-left 80s linear infinite;
                will-change: transform;
              }
              .scroll-right {
                animation: scroll-right 80s linear infinite;
                will-change: transform;
              }
              .carousel-card {
                will-change: transform;
                backface-visibility: hidden;
                transform: translateZ(0);
              }
            `}</style>
            
            {/* First row - scrolls left */}
            <div className="flex gap-4 sm:gap-6 md:gap-8 mb-4 scroll-left" style={{ width: 'fit-content' }}>
              {categories.map((category, idx) => (
                <div
                  key={`left-${idx}`}
                  onClick={() => { navigate(category.path); }}
                  className="group flex flex-col items-center cursor-pointer flex-shrink-0 w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] carousel-card"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-100 aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-2 sm:mt-3 text-gray-900 font-medium text-[10px] sm:text-sm md:text-base text-center uppercase leading-tight">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
            
            {/* Second row - scrolls right */}
            <div className="flex gap-4 sm:gap-6 md:gap-8 scroll-right" style={{ width: 'fit-content' }}>
              {categories.map((category, idx) => (
                <div
                  key={`right-${idx}`}
                  onClick={() => { navigate(category.path); }}
                  className="group flex flex-col items-center cursor-pointer flex-shrink-0 w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] carousel-card"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-100 aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-2 sm:mt-3 text-gray-900 font-medium text-[10px] sm:text-sm md:text-base text-center uppercase leading-tight">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Banner Image with Text Overlay */}
          <div className="w-full mt-4 md:mt-6 mb-0 relative rounded-xl md:rounded-2xl overflow-hidden">
            <picture>
              <source 
                media="(max-width: 1023px)" 
                srcSet="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765205176/b073eda1-3a35-4ab9-93d4-5f66f27c046b.png" 
              />
              <source 
                media="(min-width: 1024px)" 
                srcSet="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765205478/821ba8cf-8fd0-4568-8bc6-947bf94888b4.png" 
              />
              <img 
                src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765205478/821ba8cf-8fd0-4568-8bc6-947bf94888b4.png" 
                alt="TickNTrack Banner" 
                className="w-full h-auto object-cover"
              />
            </picture>
            
            {/* Text Overlay for Desktop */}
            <div className="hidden lg:flex absolute inset-0 items-center justify-end pr-8 md:pr-12 lg:pr-16 xl:pr-20">
              <div className="text-right max-w-md">
                <p className="text-sm md:text-base text-gray-700 mb-2 font-medium">Machine Washable</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 leading-tight">
                  SNEAKERS DESIGNED TO
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  MOVE YOU FORWARD.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Trust & Features Section
  const TrustSection = () => {
    const features = [
      {
        icon: <Truck className="w-8 h-8" />,
        title: "Free Express Shipping",
        description: "Complimentary delivery on orders above ₹999",
        stats: "Delivered in 2-3 days"
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: "Secure Payments",
        description: "SSL encrypted transactions for your safety",
        stats: "100% Protected"
      },
      {
        icon: <Award className="w-8 h-8" />,
        title: "Authentic Products",
        description: "Genuine products with official warranty",
        stats: "Verified by Experts"
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: "24/7 Customer Care",
        description: "Dedicated support team always available",
        stats: "Response in 2 hours"
      }
    ];

    const stats = [
      { number: "50K+", label: "Happy Customers" },
      { number: "1000+", label: "Premium Products" },
      { number: "98%", label: "Customer Satisfaction" },
      { number: "24/7", label: "Support Available" }
    ];

    return (
      <section className="pt-2 md:pt-4 pb-24 bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 w-full">
        <div className="w-full px-4 sm:pl-2 sm:pr-6 lg:pl-6 lg:pr-8 xl:pl-4 xl:pr-4 2xl:pl-4 2xl:pr-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 text-transparent bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              The TickNTrack Advantage
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Experience premium quality, exceptional service, and complete peace of mind with every purchase
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(`trust-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group text-center"
              >
                <div className={`relative bg-white rounded-2xl p-4 md:p-6 lg:p-8 border-2 transition-all duration-500 h-full min-h-[280px] md:min-h-[300px] lg:min-h-[320px] flex flex-col ${hoveredCard === `trust-${idx}` ? 'border-teal-600 shadow-xl -translate-y-2' : 'border-gray-200 shadow-md'}`}>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl mb-4 md:mb-5 lg:mb-6 text-white transition-transform duration-500 mx-auto ${hoveredCard === `trust-${idx}` ? 'scale-110 rotate-6' : 'scale-100'}`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-teal-50 text-teal-700 rounded-lg text-xs md:text-sm font-semibold">
                    <Zap className="w-3 h-3 md:w-4 md:h-4" />
                    {feature.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Top Selling Products Section
  const TopSellingSection = () => {
    const calculatePrice = (product) => {
      if (product.price !== undefined) return product.price;
      const mrp = product.mrp || 0;
      const discount = product.discountPercent || 0;
      return Math.round(mrp - (mrp * discount) / 100);
    };

    const CategoryProductsSection = ({ category }) => {
      const products = categoryProducts[category.name] || [];
      const isLoading = loadingCategories.has(category.name);
      
      // Don't show section until it has products or finished loading
      if (!isLoading && products.length === 0) {
        return null;
      }

      return (
        <section className="py-4 md:py-6 bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-4 md:mb-5">
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
            {isLoading ? (
              <>
                <div className="flex justify-center items-center mb-6">
                  <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-gray-600">Loading products...</span>
                </div>
                {/* Skeleton Placeholder Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, idx) => (
                    <div key={`skeleton-${idx}`} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-3 sm:p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-5 bg-gray-300 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : products.length === 0 ? null : (
              <>
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
                              ₹{finalPrice.toLocaleString('en-IN')}
                            </span>
                            {product.mrp && product.mrp > finalPrice && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                ₹{product.mrp.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View All Button */}
                <div className="mt-4 md:mt-5 text-center">
                  <button
                    onClick={() => navigate(category.path)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    View All {category.name}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      );
    };

    return (
      <div className="divide-y divide-gray-200/50">
        {CATEGORIES.map((category) => (
          <CategoryProductsSection key={category.name} category={category} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30">
      <CollectionShowcase />
      <CategoryGrid />
      <TopSellingSection />
      <TrustSection />
    </div>
  );
};

export default TickNTrackSections;