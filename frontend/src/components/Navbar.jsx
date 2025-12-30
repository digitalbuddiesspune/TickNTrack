import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { searchProducts } from '../services/api';
import { placeholders, getProductImage } from '../utils/imagePlaceholder';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [showSecondaryNav, setShowSecondaryNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchWrapRefDesktop = useRef(null);
  const categoryRef = useRef(null);
  const categoryButtonRefs = useRef({});
  const dropdownRef = useRef(null);
  const isClickingCategoryRef = useRef(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      // Both mobile and desktop: Show secondary nav at top, hide when scrolling down, show when scrolling up
      if (currentScrollY < 50) {
        // At top - always show
        setShowSecondaryNav(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setShowSecondaryNav(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setShowSecondaryNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const loadWishlistCount = async () => {
      try {
        const { getWishlistCount } = await import('../services/api');
        const data = await getWishlistCount();
        setWishlistCount(data.count || 0);
      } catch {
        setWishlistCount(0);
      }
    };
    
    loadWishlistCount();
    
    // Listen for wishlist updates (from custom event)
    const onWishlistUpdated = () => {
      loadWishlistCount();
    };
    
    window.addEventListener('wishlist:updated', onWishlistUpdated);
    return () => {
      window.removeEventListener('wishlist:updated', onWishlistUpdated);
    };
  }, []);

  // Check authentication status - Using in-memory state instead of localStorage
  useEffect(() => {
    // You can integrate this with your authentication context/provider
    // For now, derive auth from localStorage token to keep Navbar in sync with Router guards
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(Boolean(token));
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    
    // Listen for storage events (from other tabs/windows)
    const onStorage = (e) => {
      if (!e || e.key === 'auth_token') {
        checkAuth();
      }
    };
    
    // Listen for custom auth state change events (from same window)
    const onAuthStateChanged = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('authStateChanged', onAuthStateChanged);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('authStateChanged', onAuthStateChanged);
    };
  }, []);

  const handleLogout = () => {
    // Handle logout logic here
    // Example: authContext.logout();
    try {
      localStorage.removeItem('auth_token');
    } catch {}
    setIsAuthenticated(false);
    navigate('/signin');
  };

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  // Debounced fetch for inline search results
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      // Don't close the dropdown if it's already open - let user continue typing
      return;
    }
    setSearchLoading(true);
    setSearchOpen(true);
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(q);
        const items = data?.results || [];
        setSearchResults(items);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      const inDesktop = searchWrapRefDesktop.current && searchWrapRefDesktop.current.contains(e.target);
      if (!inDesktop) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Categories with subcategories
  const categories = [
    {
      name: "MEN'S SHOES",
      path: '/category/shoes/mens-shoes',
      subcategories: [
        { name: 'Men Sports Shoes', path: '/category/shoes/mens-shoes/Men-sports-shoes' },
        { name: 'Men Casual Shoes', path: '/category/shoes/mens-shoes/Men-casual-shoes' },
        { name: 'Men Formal Shoes', path: '/category/shoes/mens-shoes/Men-formal-shoes' },
        { name: 'Men Sneakers', path: '/category/shoes/mens-shoes/Men-sneakers' },
        { name: 'Men Boots', path: '/category/shoes/mens-shoes/Men-boots' },
        { name: 'Men Sandals', path: '/category/shoes/mens-shoes/Men-sandals' },
      ]
    },
    {
      name: "WOMEN'S SHOES",
      path: '/category/shoes/womens-shoes',
      subcategories: [
        { name: 'Women Heels', path: '/category/shoes/womens-shoes/Women-heels' },
        { name: 'Women Flats', path: '/category/shoes/womens-shoes/Women-flats' },
        { name: 'Women Sneakers', path: '/category/shoes/womens-shoes/Women-sneakers' },
        { name: 'Women Sports Shoes', path: '/category/shoes/womens-shoes/Women-sports-shoes' },
        { name: 'Women Chappals', path: '/category/shoes/womens-shoes/Women-chappals' },
        { name: 'Women Sandals', path: '/category/shoes/womens-shoes/Women-sandals' },
      ]
    },
    {
      name: "WOMEN WATCHES",
      path: '/category/watches/Women-watches',
      subcategories: [
        { name: 'Women Analog Watches', path: '/category/watches/Women-watches/Women-analog-watches' },
        { name: 'Women Digital Watches', path: '/category/watches/Women-watches/Women-digital-watches' },
        { name: 'Women Smart Watches', path: '/category/watches/Women-watches/Women-smart-watches' },
        { name: 'Women Fitness Trackers', path: '/category/watches/Women-watches/Women-fitness-trackers' },
        { name: 'Women Classic Watches', path: '/category/watches/Women-watches/Women-classic-watches' },
      ]
    },
    {
      name: "MEN WATCHES",
      path: '/category/watches/men-watches',
      subcategories: [
        { name: 'Men Analog Watches', path: '/category/watches/men-watches/Men-analog-watches' },
        { name: 'Men Digital Watches', path: '/category/watches/men-watches/Men-digital-watches' },
        { name: 'Men Smart Watches', path: '/category/watches/men-watches/Men-smart-watches' },
        { name: 'Men Sports Watches', path: '/category/watches/men-watches/Men-sports-watches' },
        { name: 'Men Luxury Watches', path: '/category/watches/men-watches/Men-luxury-watches' },
        { name: 'Men Chronograph Watches', path: '/category/watches/men-watches/Men-chronograph-watches' },
      ]
    },
    {
      name: "WOMEN ACCESSORIES",
      path: '/category/accessories/women-accessories',
      subcategories: [
        { name: 'Women Belts', path: '/category/accessories/women-accessories/women-belts' },
        { name: 'Women Goggles', path: '/category/accessories/women-accessories/women-goggles' },
        { name: 'Women Sunglasses', path: '/category/accessories/women-accessories/women-sunglasses' },
        { name: 'Women Handbags', path: '/category/accessories/women-accessories/women-handbags' },
        { name: 'Women Wallets', path: '/category/accessories/women-accessories/women-wallets' },
      ]
    },
    {
      name: "MEN ACCESSORIES",
      path: '/category/accessories/men-accessories',
      subcategories: [
        { name: 'Men Belts', path: '/category/accessories/men-accessories/men-belts' },
        { name: 'Men Goggles', path: '/category/accessories/men-accessories/men-goggles' },
        { name: 'Men Sunglasses', path: '/category/accessories/men-accessories/men-sunglasses' },
        { name: 'Men Wallets', path: '/category/accessories/men-accessories/men-wallets' },
        { name: 'Men Caps', path: '/category/accessories/men-accessories/men-caps' },
      ]
    },
  ];

  // Calculate and update dropdown position
  const calculateDropdownPosition = (categoryName) => {
    const button = categoryButtonRefs.current[categoryName];
    if (!button) {
      // Retry after a short delay if button ref is not ready
      setTimeout(() => {
        const retryButton = categoryButtonRefs.current[categoryName];
        if (retryButton) {
          calculateDropdownPosition(categoryName);
        }
      }, 50);
      return;
    }

    // Calculate position immediately
    const calculate = () => {
      const rect = button.getBoundingClientRect();
      
      // Validate that we have valid button dimensions and position
      if (!rect || rect.width === 0 || rect.height === 0) {
        return false;
      }
      
      const dropdownWidth = 256; // w-64 = 256px
      const gap = 4; // Gap between button and dropdown
      const padding = 16; // Padding from viewport edges
      
      // Position dropdown directly below the category button
      let top = rect.bottom + gap;
      
      // Align dropdown to the left edge of the button
      let left = rect.left;
      
      // Ensure dropdown stays within viewport bounds
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // If dropdown would overflow on the right, shift it left
      if (left + dropdownWidth > viewportWidth - padding) {
        left = viewportWidth - dropdownWidth - padding;
        // But never go to the left of the button's left edge
        if (left < rect.left) {
          left = rect.left;
        }
      }
      
      // Ensure dropdown doesn't go off the left edge, but prefer button alignment
      if (left < padding && rect.left > padding) {
        left = rect.left;
      } else if (left < padding) {
        left = padding;
      }
      
      // Check if dropdown would overflow at bottom
      const estimatedDropdownHeight = 450; // Approximate max height
      if (top + estimatedDropdownHeight > viewportHeight - padding) {
        // Show dropdown above the button instead
        top = rect.top - estimatedDropdownHeight - gap;
        // Ensure it doesn't go above viewport
        if (top < padding) {
          top = padding;
        }
      }
      
      // Ensure valid position values - must be positive and reasonable
      const finalTop = Math.max(padding, top);
      const finalLeft = Math.max(padding, Math.min(left, viewportWidth - dropdownWidth - padding));
      
      // Set position if values are valid
      if (finalTop >= padding && finalLeft >= padding && finalLeft < viewportWidth) {
        setDropdownPosition({
          top: finalTop,
          left: finalLeft,
          width: rect.width
        });
        return true;
      }
      return false;
    };

    // Try to calculate immediately
    if (!calculate()) {
      // If it fails, retry with requestAnimationFrame
      requestAnimationFrame(() => {
        if (!calculate()) {
          // If still fails, retry after a short delay
          setTimeout(() => {
            calculate();
          }, 50);
        }
      });
    }
  };

  // Handle category click - toggle dropdown
  const handleCategoryClick = (categoryName, event) => {
    event.preventDefault();
    event.stopPropagation();

    // Mark that we're clicking a category button immediately
    isClickingCategoryRef.current = true;

    // Toggle dropdown for both desktop and mobile
    if (activeCategory === categoryName) {
      // Close if clicking the same category
      setActiveCategory(null);
      setDropdownPosition({ top: 0, left: 0, width: 0 });
      isClickingCategoryRef.current = false;
    } else {
      // Set active category first
      setActiveCategory(categoryName);
      
      // Calculate position immediately for desktop
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        // Calculate position immediately and retry multiple times
        calculateDropdownPosition(categoryName);
        requestAnimationFrame(() => {
          calculateDropdownPosition(categoryName);
        });
        setTimeout(() => {
          calculateDropdownPosition(categoryName);
        }, 10);
        setTimeout(() => {
          calculateDropdownPosition(categoryName);
        }, 50);
        setTimeout(() => {
          calculateDropdownPosition(categoryName);
        }, 100);
      }
      
      // Reset flag after a delay to allow scroll handler to see it
      setTimeout(() => {
        isClickingCategoryRef.current = false;
      }, 400);
    }
  };

  // Handle navigation from dropdown
  const handleDropdownNavigation = (path) => {
    setActiveCategory(null);
    navigate(path);
  };

  // Update dropdown position on scroll and resize to keep it aligned with category button
  useEffect(() => {
    if (!activeCategory) {
      setDropdownPosition({ top: 0, left: 0, width: 0 });
      return;
    }

    const updatePosition = () => {
      calculateDropdownPosition(activeCategory);
    };

    // Initial position - calculate immediately and retry to ensure it works
    updatePosition();
    const timeoutId1 = setTimeout(() => {
      updatePosition();
    }, 50);
    const timeoutId2 = setTimeout(() => {
      updatePosition();
    }, 150);

    // Update position on scroll and resize to keep dropdown aligned with button
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [activeCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeCategory) return;

    const handleClickOutside = (event) => {
      // Check if click is on a category button
      const isCategoryButton = Object.values(categoryButtonRefs.current).some(
        (button) => button && button.contains(event.target)
      );

      // Check if click is inside desktop dropdown
      const isInsideDesktopDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      
      // Check if click is inside mobile dropdown or secondary nav container
      const isMobile = window.innerWidth < 768;
      let isInsideMobileDropdown = false;
      if (isMobile && categoryRef.current) {
        const secondaryNavContainer = categoryRef.current.closest('.relative');
        isInsideMobileDropdown = secondaryNavContainer && secondaryNavContainer.contains(event.target);
      }

      // Close if clicked outside both button and dropdown
      if (!isCategoryButton && !isInsideDesktopDropdown && !isInsideMobileDropdown) {
        setActiveCategory(null);
      }
    };

    // Use setTimeout to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [activeCategory]);

  return (
    <nav className="relative z-[9999] bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 w-full">
      {/* Top Bar - Dark Grey with Social Icons and Account Links */}
      <div className="bg-gray-800 text-white py-1 w-full">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-4 2xl:px-6">
          <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-0">
            {/* Social Media Icons - Left */}
            <div className="flex items-center space-x-0.5 sm:space-x-1.5 md:space-x-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors p-1"
                aria-label="Facebook"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors p-1"
                aria-label="Instagram"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors p-1"
                aria-label="Twitter"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a 
                href="mailto:info@tickntrack.com" 
                className="text-white hover:text-gray-300 transition-colors p-1"
                aria-label="Email"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors p-1"
                aria-label="Pinterest"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            {/* Account Links - Right */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 text-[10px] xs:text-xs sm:text-sm">
              {isAuthenticated ? (
                <Link to="/profile" className="text-white hover:text-gray-300 transition-colors whitespace-nowrap px-1 sm:px-0">
                  <span className="hidden xs:inline">My Account</span>
                  <span className="xs:hidden">Account</span>
                </Link>
              ) : (
                <button onClick={handleLogin} className="text-white hover:text-gray-300 transition-colors whitespace-nowrap px-1 sm:px-0">
                  <span className="hidden xs:inline">My Account</span>
                  <span className="xs:hidden">Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - White with Logo, Navigation, and Icons */}
      <div className="bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 border-b border-gray-200 w-full">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-4 2xl:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 gap-2">
            {/* Logo/Brand - Left */}
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-shrink-0 -ml-2 sm:-ml-4 md:-ml-6 lg:-ml-12"
            >
              <img 
                src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765853492/image-removebg-preview_ji9lfq.png"
                alt="TickNTrack"
                className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 w-auto object-contain"
              />
            </Link>

            {/* Navigation Menu - Center (Desktop) - Removed Categories */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-3 lg:space-x-5">
              <Link 
                to="/" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase transition-colors px-2 py-1"
              >
                HOME
              </Link>
              <Link to="/collections" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase transition-colors px-2 py-1">
                COLLECTIONS
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase transition-colors px-2 py-1">
                ABOUT
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase transition-colors px-2 py-1">
                CONTACT
              </Link>
            </div>

            {/* Icons - Right (Search, Wishlist, Cart) */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 ml-auto md:ml-0">
              {/* Search Icon */}
              <div className="relative" ref={searchWrapRefDesktop}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
                {/* Search Dropdown */}
                {searchOpen && (
                  <div className="fixed md:absolute right-4 md:right-0 left-4 md:left-auto top-[calc(var(--app-header-height,60px)+0.5rem)] md:top-full mt-0 md:mt-2 w-[calc(100vw-2rem)] md:w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[99999]">
                    <div className="p-3">
                      <input
                        type="text"
                        placeholder="Search for shoes, watches..."
                        value={searchQuery}
                        onChange={(e) => { const v = e.target.value; setSearchQuery(v); }}
                        onKeyPress={handleSearchKeyPress}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        autoFocus
                      />
                    </div>
                    {searchLoading && (
                      <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                    )}
                    {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                    )}
                    {!searchLoading && searchResults.length > 0 && (
                      <ul className="max-h-80 overflow-auto divide-y divide-gray-100">
                        {searchResults.slice(0, 8).map((p) => (
                          <li key={p._id || p.id || p.slug}>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchOpen(false);
                                navigate(`/product/${p._id || p.id || ''}`);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                            >
                              <img
                                src={getProductImage(p, 'image1') || p.image || placeholders.thumbnail}
                                alt={p.title || p.name || 'Product'}
                                className="w-12 h-16 object-cover rounded-md border border-gray-100"
                                onError={(e) => { e.target.onerror = null; e.target.src = placeholders.thumbnail; }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{p.title || p.name || 'Product'}</p>
                                {p.price && (
                                  <p className="text-xs text-gray-600">₹{Number(p.price).toLocaleString()}</p>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link to="/wishlist" className="p-1.5 sm:p-2 text-gray-700 hover:text-red-500 relative transition-all duration-200 hover:scale-110 group">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-md">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 relative transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 01-.75.75H5.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zm6.75 0a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-md">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Login Button - Right (Desktop) */}
              {!isAuthenticated && (
                <button
                  onClick={handleLogin}
                  className="hidden md:block px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 text-sm"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-200 bg-white shadow-lg relative z-[70] max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="py-4">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1 px-4">
                <Link
                  to="/"
                  className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm uppercase"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  HOME
                </Link>
                <Link
                  to="/collections"
                  className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  COLLECTIONS
                </Link>
                <Link
                  to="/about"
                  className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ABOUT
                </Link>
                <Link
                  to="/contact"
                  className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  CONTACT
                </Link>
              </nav>

              {/* Auth Section in Mobile Menu */}
              {!isAuthenticated && (
                <div className="mt-6 pt-6 px-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Secondary Navigation Bar - Categories */}
      <div 
        className={`bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 border-b border-gray-200 w-full relative transition-all duration-300 ease-in-out ${
          showSecondaryNav ? 'max-h-[70px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}
        style={{ zIndex: 9998, overflow: 'visible' }}
      >
        <div className="w-full">
          {/* Desktop: Centered horizontal layout */}
          <div className="hidden md:flex items-center justify-center space-x-2 lg:space-x-3 xl:space-x-4 py-2.5 px-4 lg:px-6 xl:px-8">
            {categories.map((category) => (
              <div key={category.name} className="relative group flex-shrink-0">
                <div
                  ref={(el) => {
                    if (el) {
                      categoryButtonRefs.current[category.name] = el;
                    }
                  }}
                  className={`flex items-center text-gray-700 hover:text-gray-900 font-medium text-xs uppercase transition-all duration-200 cursor-pointer whitespace-nowrap px-2 lg:px-2.5 py-0.5 rounded-md hover:bg-gray-50 ${
                    activeCategory === category.name ? 'text-gray-900 bg-gray-50' : ''
                  }`}
                  onClick={(e) => handleCategoryClick(category.name, e)}
                >
                  <span className="whitespace-nowrap">{category.name}</span>
                  <svg
                    className={`w-3 h-3 lg:w-3.5 lg:h-3.5 ml-1 flex-shrink-0 transition-transform duration-300 ${
                      activeCategory === category.name ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Horizontal scrollable layout */}
          <div className="md:hidden py-2.5 px-2 relative">
            <div 
              className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide" 
              ref={categoryRef}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {categories.map((category) => (
                <div key={category.name} className="relative group flex-shrink-0">
                  <div
                    ref={(el) => {
                      if (el) {
                        categoryButtonRefs.current[category.name] = el;
                      }
                    }}
                    className={`flex items-center text-gray-700 hover:text-gray-900 font-medium text-xs uppercase transition-all duration-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 ${
                      activeCategory === category.name ? 'text-gray-900 bg-gray-50 border-gray-200' : ''
                    }`}
                    onClick={(e) => handleCategoryClick(category.name, e)}
                  >
                    <span className="whitespace-nowrap">{category.name}</span>
                    <svg
                      className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform duration-300 ${
                        activeCategory === category.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile Dropdown - Shows below secondary nav */}
            {activeCategory && categories.find(cat => cat.name === activeCategory)?.subcategories && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-[9999] animate-in">
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Header */}
                  <button
                    type="button"
                    className="w-full text-left block px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-900 flex items-center gap-2"
                    onClick={() => {
                      const category = categories.find(cat => cat.name === activeCategory);
                      if (category) {
                        handleDropdownNavigation(category.path);
                      }
                    }}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>All {activeCategory}</span>
                    <svg className="w-3.5 h-3.5 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Subcategories */}
                  <div className="py-2">
                    {categories.find(cat => cat.name === activeCategory)?.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.name}
                        type="button"
                        className="w-full text-left block px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group"
                        onClick={() => handleDropdownNavigation(subcategory.path)}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-600 transition-colors"></div>
                        <span className="font-medium">{subcategory.name}</span>
                        <svg className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown - Rendered with Portal (Desktop only) */}
      {activeCategory && categories.find(cat => cat.name === activeCategory)?.subcategories && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="hidden md:block fixed z-[99999] animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: dropdownPosition.top > 0 ? `${dropdownPosition.top}px` : '150px',
            left: dropdownPosition.left > 0 ? `${dropdownPosition.left}px` : '50%',
            transform: dropdownPosition.left > 0 ? 'none' : 'translateX(-50%)',
            pointerEvents: 'auto'
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-64 min-w-[200px]">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <button
                type="button"
                className="w-full text-left block px-5 py-3.5 text-sm font-semibold text-gray-900 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                onClick={() => {
                  const category = categories.find(cat => cat.name === activeCategory);
                  if (category) {
                    handleDropdownNavigation(category.path);
                  }
                }}
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>All {activeCategory}</span>
                <svg className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Subcategories */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {categories.find(cat => cat.name === activeCategory)?.subcategories.map((subcategory) => (
                <button
                  key={subcategory.name}
                  type="button"
                  className="w-full text-left block px-5 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 border-l-3 border-transparent hover:border-gray-900 group"
                  onClick={() => handleDropdownNavigation(subcategory.path)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors"></div>
                    <span className="font-medium">{subcategory.name}</span>
                    <svg className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Styles for Dropdown */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .border-l-3 {
          border-left-width: 3px;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;