import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaRupeeSign, FaSpinner, FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaHeart, FaRegHeart } from 'react-icons/fa';
import { fetchProducts, addToWishlist, removeFromWishlist, getWishlist } from '../services/api';
import { placeholders, getProductImage } from '../utils/imagePlaceholder';

// Add CSS to hide scrollbar and loading animation
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(300%);
    }
  }
  @keyframes slide-in-from-right {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  .animate-in {
    animation: slide-in-from-right 0.3s ease-out;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #14b8a6;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #0d9488;
  }
  /* Ensure sticky positioning works */
  .filter-sticky-container {
    position: relative;
    overflow: visible !important;
  }
  .filter-sticky-sidebar {
    position: -webkit-sticky !important;
    position: sticky !important;
  }
`;

const ProductList = ({ defaultCategory } = {}) => {
  const { categoryName, subCategoryName, mainCategory } = useParams();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const filterSidebarRef = useRef(null);
  const filterContainerRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(80);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(20); // Initial products to show
  const [sortBy, setSortBy] = useState('relevance'); // Sort state
  
  // Filter states
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [customPriceFrom, setCustomPriceFrom] = useState('');
  const [customPriceTo, setCustomPriceTo] = useState('');
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  
  // Product-specific filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedShoeMaterials, setSelectedShoeMaterials] = useState([]);
  const [selectedShoeTypes, setSelectedShoeTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedWatchMovements, setSelectedWatchMovements] = useState([]);
  const [selectedWatchCaseMaterials, setSelectedWatchCaseMaterials] = useState([]);
  const [selectedWatchBandMaterials, setSelectedWatchBandMaterials] = useState([]);
  const [selectedWaterResistance, setSelectedWaterResistance] = useState([]);
  
  // Wishlist state
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
  
  // Accordion states for desktop filters
  const [openSections, setOpenSections] = useState({
    price: true,
    material: true,
    brand: true,
    type: true,
    size: true,
    movement: true,
    caseMaterial: true,
    bandMaterial: true,
    waterResistance: true
  });
  
  // Normalize category name helper
  const normalize = (s) => {
    if (!s) return '';
    const t = s.replace(/-/g, ' ').toLowerCase();
    return t.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Handle 3-segment paths: /category/shoes/mens-shoes/sports-shoes
  // Calculate effectiveCategory and effectiveSubCategory
  const effectiveCategory = React.useMemo(() => {
    if (mainCategory && categoryName && subCategoryName) {
      // 3-segment path: /category/shoes/mens-shoes/sports-shoes
      return normalize(categoryName); // "Mens Shoes"
    } else if (categoryName && subCategoryName) {
      // 2-segment path: /category/shoes/mens-shoes
      return normalize(categoryName); // "Shoes"
    } else if (categoryName) {
      // 1-segment path: /category/shoes
      return normalize(categoryName); // "Shoes"
    }
    return '';
  }, [mainCategory, categoryName, subCategoryName]);

  const effectiveSubCategory = React.useMemo(() => {
    if (mainCategory && categoryName && subCategoryName) {
      // 3-segment path: /category/shoes/mens-shoes/sports-shoes
      return normalize(subCategoryName); // "Sports Shoes"
    } else if (categoryName && subCategoryName) {
      // 2-segment path: /category/shoes/mens-shoes
      return normalize(subCategoryName); // "Mens Shoes"
    }
    return '';
  }, [mainCategory, categoryName, subCategoryName]);
  
  // Detect product type from category
  const isShoesCategory = React.useMemo(() => {
    const cat = (effectiveCategory || effectiveSubCategory || '').toLowerCase();
    return cat.includes('shoe') || cat.includes('sneaker') || cat.includes('boot') || cat.includes('sandal');
  }, [effectiveCategory, effectiveSubCategory]);
  
  const isWatchCategory = React.useMemo(() => {
    const cat = (effectiveCategory || effectiveSubCategory || '').toLowerCase();
    return cat.includes('watch');
  }, [effectiveCategory, effectiveSubCategory]);

  // Calculate navbar height for sticky positioning
  useEffect(() => {
    const calculateNavbarHeight = () => {
      // First try to get from CSS variable set by Layout component
      const root = document.documentElement;
      const cssVar = getComputedStyle(root).getPropertyValue('--app-header-height').trim();
      if (cssVar && cssVar !== '0px') {
        const height = parseFloat(cssVar);
        if (!isNaN(height) && height > 0) {
          setNavbarHeight(height);
          return;
        }
      }
      
      // Fallback: calculate from navbar element
      const navbar = document.querySelector('nav');
      if (navbar) {
        const height = navbar.offsetHeight || navbar.getBoundingClientRect().height;
        if (height > 0) {
          setNavbarHeight(height);
          return;
        }
      }
      
      // Calculate from fixed header wrapper
      const headerWrapper = document.querySelector('[ref*="headerWrapRef"], .fixed.top-0');
      if (headerWrapper) {
        const height = headerWrapper.offsetHeight || headerWrapper.getBoundingClientRect().height;
        if (height > 0) {
          setNavbarHeight(height);
          return;
        }
      }
      
      // Final fallback: approximate navbar height
      const fallbackHeight = window.innerWidth >= 768 ? 80 : 72;
      setNavbarHeight(fallbackHeight);
    };
    
    // Calculate on mount and after delays to ensure navbar is rendered
    calculateNavbarHeight();
    const timeoutId = setTimeout(calculateNavbarHeight, 100);
    const timeoutId2 = setTimeout(calculateNavbarHeight, 300);
    const timeoutId3 = setTimeout(calculateNavbarHeight, 600);
    
    window.addEventListener('resize', calculateNavbarHeight);
    window.addEventListener('load', calculateNavbarHeight);
    
    // Also listen for when navbar might change
    const observer = new MutationObserver(calculateNavbarHeight);
    const navbar = document.querySelector('nav');
    if (navbar) {
      observer.observe(navbar, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    }
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener('resize', calculateNavbarHeight);
      window.removeEventListener('load', calculateNavbarHeight);
      observer.disconnect();
    };
  }, []);

  // Handle scroll to ensure filter stays below navbar
  useEffect(() => {
    const handleScroll = () => {
      if (!filterContainerRef.current) return;
      
      const container = filterContainerRef.current;
      const rect = container.getBoundingClientRect();
      const shouldBeSticky = rect.top <= navbarHeight;
      
      setIsFilterSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navbarHeight]);
  
  // Available fabric options
  const allPossibleFabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Satin', 'Velvet', 'Organza', 'Banarasi', 'Kanjivaram', 'Katan', 'Tussar', 'Maheshwari', 'Chanderi', 'Kota', 'Gota Patti', 'Zari', 'Zardosi', 'Resham', 'Kalamkari', 'Bandhani', 'Leheriya', 'Patola', 'Paithani', 'Baluchari', 'Dhakai', 'Jamdani', 'Khesh', 'Muga', 'Eri', 'Mysore', 'Uppada', 'Gadwal', 'Venkatagiri', 'Narayanpet', 'Bomkai', 'Sambalpuri', 'Khandua', 'Kotpad', 'Bhagalpur', 'Tussar', 'Muga', 'Eri', 'Mysore Silk', 'Kanchipuram', 'Kanjivaram', 'Banarasi Silk', 'Chanderi', 'Maheshwari', 'Kota Doria', 'Gota Work', 'Zari Work', 'Zardosi Work', 'Resham Work', 'Kalamkari', 'Bandhani', 'Leheriya', 'Patola', 'Paithani', 'Baluchari', 'Dhakai', 'Jamdani', 'Khesh', 'Muga', 'Eri', 'Mysore', 'Uppada', 'Gadwal', 'Venkatagiri', 'Narayanpet', 'Bomkai', 'Sambalpuri', 'Khandua', 'Kotpad', 'Bhagalpur', 'Tussar', 'Muga', 'Eri', 'Mysore Silk', 'Kanchipuram', 'Kanjivaram', 'Banarasi Silk', 'Chanderi', 'Maheshwari', 'Kota Doria', 'Gota Work', 'Zari Work', 'Zardosi Work', 'Resham Work', 'Kalamkari', 'Bandhani', 'Leheriya', 'Patola', 'Paithani', 'Baluchari', 'Dhakai', 'Jamdani', 'Khesh', 'Muga', 'Eri', 'Mysore', 'Uppada', 'Gadwal', 'Venkatagiri', 'Narayanpet', 'Bomkai', 'Sambalpuri', 'Khandua', 'Kotpad', 'Bhagalpur', 'Tussar', 'Muga', 'Eri', 'Mysore Silk', 'Kanchipuram', 'Kanjivaram', 'Banarasi Silk', 'Chanderi', 'Maheshwari', 'Kota Doria', 'Gota Work', 'Zari Work', 'Zardosi Work', 'Resham Work', 'Kalamkari', 'Bandhani', 'Leheriya', 'Patola', 'Paithani', 'Baluchari', 'Dhakai', 'Jamdani', 'Khesh', 'Muga', 'Eri', 'Mysore', 'Uppada', 'Gadwal', 'Venkatagiri', 'Narayanpet', 'Bomkai', 'Sambalpuri', 'Khandua', 'Kotpad', 'Bhagalpur', 'Tussar', 'Muga', 'Eri', 'Mysore Silk', 'Kanchipuram', 'Kanjivaram', 'Banarasi Silk', 'Chanderi', 'Maheshwari', 'Kota Doria', 'Gota Work', 'Zari Work', 'Zardosi Work', 'Resham Work'];
  
  // Extract unique values from products based on type
  const availableBrands = React.useMemo(() => {
    const brandSet = new Set();
    products.forEach(product => {
      const brand = product.product_info?.brand || product.brand;
      if (brand && typeof brand === 'string') brandSet.add(brand.trim());
    });
    return Array.from(brandSet).sort();
  }, [products]);
  
  const availableShoeMaterials = React.useMemo(() => {
    const materialSet = new Set();
    products.forEach(product => {
      const material = product.product_info?.shoeMaterial || product.product_info?.SareeMaterial;
      if (material && typeof material === 'string') {
        material.split(',').forEach(m => {
          const trimmed = m.trim();
          if (trimmed) materialSet.add(trimmed);
        });
      }
    });
    return Array.from(materialSet).sort();
  }, [products]);
  
  const availableShoeTypes = React.useMemo(() => {
    const typeSet = new Set();
    products.forEach(product => {
      const type = product.product_info?.shoeType;
      if (type && typeof type === 'string') typeSet.add(type.trim());
    });
    return Array.from(typeSet).sort();
  }, [products]);
  
  const availableSizes = React.useMemo(() => {
    const sizeSet = new Set();
    products.forEach(product => {
      const sizes = product.product_info?.availableSizes || [];
      if (Array.isArray(sizes)) {
        sizes.forEach(size => {
          if (size) sizeSet.add(String(size).trim());
        });
      }
    });
    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [products]);
  
  const availableWatchMovements = React.useMemo(() => {
    const movementSet = new Set();
    products.forEach(product => {
      const movement = product.product_info?.movementType;
      if (movement && typeof movement === 'string') movementSet.add(movement.trim());
    });
    return Array.from(movementSet).sort();
  }, [products]);
  
  const availableWatchCaseMaterials = React.useMemo(() => {
    const materialSet = new Set();
    products.forEach(product => {
      const material = product.product_info?.caseMaterial;
      if (material && typeof material === 'string') {
        material.split(',').forEach(m => {
          const trimmed = m.trim();
          if (trimmed) materialSet.add(trimmed);
        });
      }
    });
    return Array.from(materialSet).sort();
  }, [products]);
  
  const availableWatchBandMaterials = React.useMemo(() => {
    const materialSet = new Set();
    products.forEach(product => {
      const material = product.product_info?.bandMaterial;
      if (material && typeof material === 'string') {
        material.split(',').forEach(m => {
          const trimmed = m.trim();
          if (trimmed) materialSet.add(trimmed);
        });
      }
    });
    return Array.from(materialSet).sort();
  }, [products]);
  
  const availableWaterResistance = React.useMemo(() => {
    const wrSet = new Set();
    products.forEach(product => {
      const wr = product.product_info?.waterResistance;
      if (wr && typeof wr === 'string') wrSet.add(wr.trim());
    });
    return Array.from(wrSet).sort();
  }, [products]);
  
  // Available fabric options (for non-shoe/watch products)
  const availableFabrics = React.useMemo(() => {
    if (isShoesCategory || isWatchCategory) return [];
    const fabricSet = new Set();
    products.forEach(product => {
      const material = product.product_info?.SareeMaterial || product.product_info?.fabric;
      if (material && typeof material === 'string') {
        material.split(',').forEach(m => {
          const trimmed = m.trim();
          if (trimmed && allPossibleFabrics.some(f => trimmed.toLowerCase().includes(f.toLowerCase()))) {
            fabricSet.add(trimmed);
          }
        });
      }
    });
    return Array.from(fabricSet).sort();
  }, [products, isShoesCategory, isWatchCategory]);
  
  const priceRanges = [
    { id: 1, label: '₹100 - ₹200', min: 100, max: 200 },
    { id: 2, label: '₹201 - ₹500', min: 201, max: 500 },
    { id: 3, label: '₹501 - ₹800', min: 501, max: 800 },
    { id: 4, label: '₹801 - ₹1,100', min: 801, max: 1100 },
    { id: 5, label: '₹1,101 - ₹1,400', min: 1101, max: 1400 },
    { id: 6, label: '₹1,401 - ₹1,700', min: 1401, max: 1700 },
    { id: 7, label: '₹1,701 - ₹2,000', min: 1701, max: 2000 },
    { id: 8, label: '₹2,001 - ₹2,300', min: 2001, max: 2300 },
    { id: 9, label: '₹2,300 - ₹2,500', min: 2300, max: 2500 },
    { id: 10, label: '₹2,500 and above', min: 2500, max: Infinity },
  ];
  
  // Fetch products
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // Clear products immediately when category changes
        setProducts([]);
        setFilteredProducts([]);
        setDisplayCount(20); // Reset to initial 20 products when category changes
        
        // Use subcategory if available, otherwise use category
        const data = await fetchProducts(effectiveCategory, effectiveSubCategory || null);
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [effectiveCategory, effectiveSubCategory]);
  
  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlist = await getWishlist();
        if (wishlist && wishlist.items) {
          const wishlistIds = new Set(wishlist.items.map(item => item.product?._id || item.product));
          setWishlistedProducts(wishlistIds);
        }
      } catch (err) {
        // Silently fail if user is not logged in
        console.log('Wishlist not available');
      }
    };
    loadWishlist();
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlist();
    };
    window.addEventListener('wishlist:updated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist:updated', handleWishlistUpdate);
    };
  }, []);
  
  // Handle wishlist toggle
  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();
    if (!productId) return;
    
    try {
      const isWishlisted = wishlistedProducts.has(productId);
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setWishlistedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        try { window.dispatchEvent(new Event('wishlist:updated')); } catch {}
      } else {
        await addToWishlist(productId);
        setWishlistedProducts(prev => new Set([...prev, productId]));
        try { window.dispatchEvent(new Event('wishlist:updated')); } catch {}
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
  };
  
  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Filter by price range (always available)
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.id === selectedPriceRange);
      if (range) {
        result = result.filter(p => {
          const price = p.price || (p.mrp - p.mrp * ((p.discountPercent || 0) / 100));
          return price >= range.min && price <= range.max;
        });
      }
    }
    
    // Filter by brand (common for shoes and watches)
    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        const brand = (p.product_info?.brand || p.brand || '').trim();
        return selectedBrands.some(selectedBrand => 
          brand.toLowerCase() === selectedBrand.toLowerCase()
        );
      });
    }
    
    // Shoes-specific filters
    if (isShoesCategory) {
      // Filter by shoe material
      if (selectedShoeMaterials.length > 0) {
        result = result.filter(p => {
          const material = (p.product_info?.shoeMaterial || '').toLowerCase();
          return selectedShoeMaterials.some(selectedMaterial => 
            material.includes(selectedMaterial.toLowerCase())
          );
        });
      }
      
      // Filter by shoe type
      if (selectedShoeTypes.length > 0) {
        result = result.filter(p => {
          const type = (p.product_info?.shoeType || '').trim();
          return selectedShoeTypes.some(selectedType => 
            type.toLowerCase() === selectedType.toLowerCase()
          );
        });
      }
      
      // Filter by size
      if (selectedSizes.length > 0) {
        result = result.filter(p => {
          const sizes = p.product_info?.availableSizes || [];
          return selectedSizes.some(selectedSize => 
            sizes.some(size => String(size).trim() === selectedSize.trim())
          );
        });
      }
    }
    
    // Watches-specific filters
    if (isWatchCategory) {
      // Filter by movement type
      if (selectedWatchMovements.length > 0) {
        result = result.filter(p => {
          const movement = (p.product_info?.movementType || '').trim();
          return selectedWatchMovements.some(selectedMovement => 
            movement.toLowerCase() === selectedMovement.toLowerCase()
          );
        });
      }
      
      // Filter by case material
      if (selectedWatchCaseMaterials.length > 0) {
        result = result.filter(p => {
          const material = (p.product_info?.caseMaterial || '').toLowerCase();
          return selectedWatchCaseMaterials.some(selectedMaterial => 
            material.includes(selectedMaterial.toLowerCase())
          );
        });
      }
      
      // Filter by band material
      if (selectedWatchBandMaterials.length > 0) {
        result = result.filter(p => {
          const material = (p.product_info?.bandMaterial || '').toLowerCase();
          return selectedWatchBandMaterials.some(selectedMaterial => 
            material.includes(selectedMaterial.toLowerCase())
          );
        });
      }
      
      // Filter by water resistance
      if (selectedWaterResistance.length > 0) {
        result = result.filter(p => {
          const wr = (p.product_info?.waterResistance || '').trim();
          return selectedWaterResistance.some(selectedWR => 
            wr.toLowerCase() === selectedWR.toLowerCase()
          );
        });
      }
    }
    
    // Filter by fabric (for non-shoe/watch products)
    if (!isShoesCategory && !isWatchCategory && selectedFabrics.length > 0) {
      result = result.filter(p => {
        const material = (p.product_info?.SareeMaterial || p.product_info?.fabric || '').toLowerCase();
        return selectedFabrics.some(fabric => 
          material.includes(fabric.toLowerCase())
        );
      });
    }
    
    // Apply sorting
    if (sortBy !== 'relevance') {
      switch(sortBy) {
        case 'price-low-high':
          result.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high-low':
          result.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredProducts(result);
    // Reset display count when filters change
    setDisplayCount(20);
  }, [
    products, 
    selectedPriceRange, 
    selectedFabrics, 
    selectedBrands,
    selectedShoeMaterials,
    selectedShoeTypes,
    selectedSizes,
    selectedWatchMovements,
    selectedWatchCaseMaterials,
    selectedWatchBandMaterials,
    selectedWaterResistance,
    isShoesCategory,
    isWatchCategory,
    sortBy
  ]);
  
  const toggleFabric = (fabric) => {
    setSelectedFabrics(prev => 
      prev.includes(fabric)
        ? prev.filter(f => f !== fabric)
        : [...prev, fabric]
    );
  };
  
  const resetFilters = () => {
    setSelectedPriceRange(null);
    setSelectedFabrics([]);
    setSelectedBrands([]);
    setSelectedShoeMaterials([]);
    setSelectedShoeTypes([]);
    setSelectedSizes([]);
    setSelectedWatchMovements([]);
    setSelectedWatchCaseMaterials([]);
    setSelectedWatchBandMaterials([]);
    setSelectedWaterResistance([]);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

    
  // Scroll to top whenever category changes so the heading/top section is visible
  useEffect(() => {
    // Small delay to ensure page has rendered
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, [categoryName, subCategoryName, mainCategory]);

  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const activeFilterCount = [
    selectedFabrics.length,
    selectedBrands.length,
    selectedShoeMaterials.length,
    selectedShoeTypes.length,
    selectedSizes.length,
    selectedWatchMovements.length,
    selectedWatchCaseMaterials.length,
    selectedWatchBandMaterials.length,
    selectedWaterResistance.length,
    selectedPriceRange ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const FilterContent = () => (
    <div className="space-y-0">
      {/* Sort By Dropdown - Matching image design */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="bg-white rounded-md border border-gray-200 p-3 relative">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Sort By :</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
              className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-none outline-none appearance-none cursor-pointer pr-6"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 text-xs pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button 
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
        >
          <h4 className="text-sm font-medium text-gray-900">Price</h4>
          <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.price ? 'transform rotate-180' : ''}`} />
        </button>
        
        {openSections.price && (
          <div className="pb-4 space-y-2">
            {priceRanges.map(range => (
              <div key={range.id} className="flex items-center group">
                <input
                  type="radio"
                  id={`price-${range.id}`}
                  name="priceRange"
                  checked={selectedPriceRange === range.id}
                  onChange={() => setSelectedPriceRange(range.id)}
                  className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 cursor-pointer"
                />
                <label 
                  htmlFor={`price-${range.id}`} 
                  className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                    selectedPriceRange === range.id 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Brand Filter (for Shoes and Watches) */}
      {(isShoesCategory || isWatchCategory) && availableBrands.length > 0 && (
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('brand')}
            className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
          >
            <h4 className="text-sm font-medium text-gray-900">Brand</h4>
            <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.brand ? 'transform rotate-180' : ''}`} />
          </button>
          
          {openSections.brand && (
            <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
              {availableBrands.map(brand => (
                <div key={brand} className="flex items-center group">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => setSelectedBrands(prev => 
                      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                    )}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label 
                    htmlFor={`brand-${brand}`} 
                    className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                      selectedBrands.includes(brand)
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shoe-specific Filters */}
      {isShoesCategory && (
        <>
          {/* Shoe Material Filter */}
          {availableShoeMaterials.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('material')}
                className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900">Material</h4>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.material ? 'transform rotate-180' : ''}`} />
              </button>
              
              {openSections.material && (
                <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                  {availableShoeMaterials.map(material => (
                    <div key={material} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`shoe-material-${material}`}
                        checked={selectedShoeMaterials.includes(material)}
                        onChange={() => setSelectedShoeMaterials(prev => 
                          prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
                        )}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`shoe-material-${material}`} 
                        className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                          selectedShoeMaterials.includes(material)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shoe Type Filter */}
          {availableShoeTypes.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('type')}
                className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900">Type</h4>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.type ? 'transform rotate-180' : ''}`} />
              </button>
              
              {openSections.type && (
                <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                  {availableShoeTypes.map(type => (
                    <div key={type} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`shoe-type-${type}`}
                        checked={selectedShoeTypes.includes(type)}
                        onChange={() => setSelectedShoeTypes(prev => 
                          prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                        )}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`shoe-type-${type}`} 
                        className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                          selectedShoeTypes.includes(type)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Size Filter */}
          {availableSizes.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('size')}
                className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900">Size</h4>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.size ? 'transform rotate-180' : ''}`} />
              </button>
              
              {openSections.size && (
                <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                  {availableSizes.map(size => (
                    <div key={size} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onChange={() => setSelectedSizes(prev => 
                          prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                        )}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`size-${size}`} 
                        className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                          selectedSizes.includes(size)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Watch-specific Filters */}
      {isWatchCategory && (
        <>
          {/* Movement Type Filter */}
          {availableWatchMovements.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('movement')}
                className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900">Movement Type</h4>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.movement ? 'transform rotate-180' : ''}`} />
              </button>
              
              {openSections.movement && (
                <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                  {availableWatchMovements.map(movement => (
                    <div key={movement} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`movement-${movement}`}
                        checked={selectedWatchMovements.includes(movement)}
                        onChange={() => setSelectedWatchMovements(prev => 
                          prev.includes(movement) ? prev.filter(m => m !== movement) : [...prev, movement]
                        )}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`movement-${movement}`} 
                        className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                          selectedWatchMovements.includes(movement)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {movement}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Case Material Filter */}
          {availableWatchCaseMaterials.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('caseMaterial')}
                className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900">Case Material</h4>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.caseMaterial ? 'transform rotate-180' : ''}`} />
              </button>
              
              {openSections.caseMaterial && (
                <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                  {availableWatchCaseMaterials.map(material => (
                    <div key={material} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`case-material-${material}`}
                        checked={selectedWatchCaseMaterials.includes(material)}
                        onChange={() => setSelectedWatchCaseMaterials(prev => 
                          prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
                        )}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`case-material-${material}`} 
                        className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                          selectedWatchCaseMaterials.includes(material)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Band Material Filter */}
          {availableWatchBandMaterials.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('bandMaterial')}
                className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900">Band Material</h4>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.bandMaterial ? 'transform rotate-180' : ''}`} />
              </button>
              
              {openSections.bandMaterial && (
                <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                  {availableWatchBandMaterials.map(material => (
                    <div key={material} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`band-material-${material}`}
                        checked={selectedWatchBandMaterials.includes(material)}
                        onChange={() => setSelectedWatchBandMaterials(prev => 
                          prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
                        )}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`band-material-${material}`} 
                        className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                          selectedWatchBandMaterials.includes(material)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Water Resistance Filter */}
          {availableWaterResistance.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('waterResistance')}
                className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900">Water Resistance</h4>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.waterResistance ? 'transform rotate-180' : ''}`} />
              </button>
              
              {openSections.waterResistance && (
                <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                  {availableWaterResistance.map(wr => (
                    <div key={wr} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`water-resistance-${wr}`}
                        checked={selectedWaterResistance.includes(wr)}
                        onChange={() => setSelectedWaterResistance(prev => 
                          prev.includes(wr) ? prev.filter(w => w !== wr) : [...prev, wr]
                        )}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`water-resistance-${wr}`} 
                        className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                          selectedWaterResistance.includes(wr)
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {wr}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Fabric Filter (for non-shoe/watch products) */}
      {!isShoesCategory && !isWatchCategory && availableFabrics.length > 0 && (
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('material')}
            className="flex justify-between items-center w-full py-3 px-0 bg-white hover:bg-gray-50 transition-colors"
          >
            <h4 className="text-sm font-medium text-gray-900">Fabric</h4>
            <FaChevronDown className={`text-gray-500 text-xs transition-transform ${openSections.material ? 'transform rotate-180' : ''}`} />
          </button>
          
          {openSections.material && (
            <div className="pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-2">
              {availableFabrics.map(material => (
                <div key={material} className="flex items-center group">
                  <input
                    type="checkbox"
                    id={`material-${material}`}
                    checked={selectedFabrics.includes(material)}
                    onChange={() => toggleFabric(material)}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label 
                    htmlFor={`material-${material}`} 
                    className={`ml-3 text-sm cursor-pointer flex-1 py-1 transition-all ${
                      selectedFabrics.includes(material)
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {material}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
    </div>
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" style={{ position: 'relative', overflowX: 'hidden' }}>
      <style>{styles}</style>
      {loading && (
        <div className="fixed left-0 right-0 top-0 z-50">
          <div className="h-1 bg-teal-600 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite]"></div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Modern Header */}
        <div className="mb-2 sm:mb-4">
          <div className="flex flex-col items-center text-center mb-2 sm:mb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 uppercase mb-1 sm:mb-2">
              {effectiveSubCategory
                ? effectiveSubCategory
                : (effectiveCategory
                    ? effectiveCategory
                    : 'All Products')}
            </h1>
          </div>
        </div>

        <div ref={filterContainerRef} className="flex gap-6 lg:gap-8 relative filter-sticky-container" style={{ position: 'relative', overflow: 'visible' }}>
          {/* Desktop Sidebar Filters - Sticky below navbar */}
          <aside className="hidden lg:block w-72 flex-shrink-0" style={{ alignSelf: 'flex-start', position: 'relative' }}>
            <div 
              ref={filterSidebarRef}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-5 overflow-y-auto scrollbar-hide filter-sticky-sidebar"
              style={{ 
                position: 'sticky',
                top: `${navbarHeight}px`,
                maxHeight: `calc(100vh - ${navbarHeight}px)`,
                zIndex: 40,
                marginTop: 0
              }}
            >
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button & Active Filters */}
            <div className="lg:hidden mb-3 space-y-2">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-700 hover:border-teal-600 hover:bg-teal-50 shadow-sm hover:shadow-md transition-all text-sm"
              >
                <FaFilter className="text-teal-600 text-sm" />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-teal-600 text-white text-xs font-bold rounded-full shadow-sm">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Active Filters Pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {selectedPriceRange && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                      <button 
                        onClick={() => setSelectedPriceRange(null)}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                  
                  {(customPriceFrom || customPriceTo) && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      ₹{customPriceFrom || '0'}-₹{customPriceTo || '∞'}
                      <button 
                        onClick={() => {
                          setCustomPriceFrom('');
                          setCustomPriceTo('');
                        }}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                  
                  {selectedBrands.map(brand => (
                    <span key={brand} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {brand}
                      <button 
                        onClick={() => setSelectedBrands(prev => prev.filter(b => b !== brand))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedShoeMaterials.map(material => (
                    <span key={material} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {material}
                      <button 
                        onClick={() => setSelectedShoeMaterials(prev => prev.filter(m => m !== material))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedShoeTypes.map(type => (
                    <span key={type} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {type}
                      <button 
                        onClick={() => setSelectedShoeTypes(prev => prev.filter(t => t !== type))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedSizes.map(size => (
                    <span key={size} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      Size {size}
                      <button 
                        onClick={() => setSelectedSizes(prev => prev.filter(s => s !== size))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedWatchMovements.map(movement => (
                    <span key={movement} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {movement}
                      <button 
                        onClick={() => setSelectedWatchMovements(prev => prev.filter(m => m !== movement))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedWatchCaseMaterials.map(material => (
                    <span key={material} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {material}
                      <button 
                        onClick={() => setSelectedWatchCaseMaterials(prev => prev.filter(m => m !== material))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedWatchBandMaterials.map(material => (
                    <span key={material} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {material}
                      <button 
                        onClick={() => setSelectedWatchBandMaterials(prev => prev.filter(m => m !== material))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedWaterResistance.map(wr => (
                    <span key={wr} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {wr}
                      <button 
                        onClick={() => setSelectedWaterResistance(prev => prev.filter(w => w !== wr))}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedFabrics.map(fabric => (
                    <span key={fabric} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {fabric}
                      <button 
                        onClick={() => toggleFabric(fabric)}
                        className="ml-1.5 hover:scale-110 transition-transform"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="relative min-h-[500px] flex items-center justify-center">
                {/* Modern Loading Spinner */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-teal-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">Loading products...</p>
                  <p className="text-gray-500 text-sm">Please wait while we fetch the best products for you</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                {activeFilterCount > 0 ? (
                  <>
                    <div className="mb-6">
                      <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-700 text-xl font-semibold mb-2">No products found</p>
                      <p className="text-gray-500">Try adjusting your filters to see more results</p>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-teal-600 font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Clear all filters
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-700 text-xl font-semibold mb-2">No products available</p>
                      <p className="text-gray-500 mb-1">Check back soon for new arrivals!</p>
                    </div>
                    <Link
                      to="/"
                      className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-teal-600 font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Continue Shopping
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-5 lg:gap-6">
                  {filteredProducts.slice(0, displayCount).map((p) => (
                  <div
                    key={p._id || p.title}
                    className="group bg-white overflow-hidden rounded-lg shadow-sm sm:shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 hover:border-2 hover:border-teal-500"
                    onClick={() => handleCardClick(p)}
                  >
                    <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                      <img
                        src={getProductImage(p, 'image1')}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholders.productList;
                        }}
                      />
                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, p._id)}
                        className={`absolute top-2 left-2 sm:top-4 sm:left-4 z-10 rounded-full p-2 shadow-md transition-all ${
                          wishlistedProducts.has(p._id)
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-white text-red-600 hover:bg-red-50'
                        }`}
                        aria-label={wishlistedProducts.has(p._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        {wishlistedProducts.has(p._id) ? (
                          <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        ) : (
                          <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                      {(p.discountPercent > 0 || p.discount) && (
                        <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-teal-600 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg shadow-md sm:shadow-lg uppercase">
                          {p.discountPercent || p.discount}% OFF
                        </span>
                      )}
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="relative p-3 sm:p-4 md:p-5 bg-white">
                      <div className="flex justify-between items-start mb-1 sm:mb-2">
                        <h3 className="text-xs font-semibold text-teal-600 uppercase tracking-wide line-clamp-1">
                          {p.product_info?.manufacturer || 'VARNICRAFTS'}
                        </h3>
                      </div>
                      
                      <p className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 mb-2 sm:mb-3 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-teal-600 transition-colors">
                        {p.title || 'Untitled Product'}
                      </p>
                
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                        <div className="flex items-center">
                          <FaRupeeSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-900" />
                          <span className="text-lg sm:text-xl font-bold text-gray-900 ml-0.5">
                            {p.price?.toLocaleString() || Math.round(p.mrp - p.mrp * ((p.discountPercent || 0) / 100)).toLocaleString()}
                          </span>
                        </div>
                        {p.mrp && p.mrp > (p.price || 0) && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{p.mrp.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                
                {/* Load More Button */}
                {filteredProducts.length > displayCount && (
                  <div className="flex justify-center mt-8 sm:mt-12">
                    <button
                      onClick={() => setDisplayCount(prev => prev + 20)}
                      className="px-8 py-3 sm:px-12 sm:py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                    >
                      Load More {filteredProducts.length - displayCount} Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modern Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMobileFilters(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl overflow-y-auto custom-scrollbar animate-in slide-in-from-right">
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 px-6 py-5 flex justify-between items-center z-10 shadow-lg">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaFilter className="text-teal-600" />
                Filters
              </h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-white hover:bg-teal-600 p-2 rounded-lg transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            
            {/* Filter Content */}
            <div className="p-6">
              <FilterContent />
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 px-6 py-5 shadow-2xl">
              <div className="mb-3 text-center">
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900 text-lg">{filteredProducts.length}</span> products found
                </span>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;