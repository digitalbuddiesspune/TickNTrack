import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Categories with subcategories (same structure as Navbar for consistency)
const CATEGORIES = [
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
  },
];

const SecondaryNavbar = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const isCategoryActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        navRef.current &&
        !navRef.current.contains(e.target)
      ) {
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setActiveCategory(null);
        setIsMobileCategoriesOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    setIsMobileCategoriesOpen(false);
  }, [location.pathname]);

  return (
    <div
      ref={navRef}
      className="border-t border-gray-200 bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 w-full"
      aria-label="Category navigation"
    >
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-4 2xl:px-6">
        {/* Desktop: horizontal category bar with dropdowns - header style */}
        <div className="hidden md:flex items-center justify-center gap-0 py-1 min-h-[36px]">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => setActiveCategory(cat.name)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                to={cat.path}
                className={`block px-3 py-1.5 text-xs font-medium uppercase transition-colors whitespace-nowrap rounded-md ${
                  isCategoryActive(cat.path)
                    ? 'text-teal-800 bg-white/80 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {cat.name}
              </Link>
              {activeCategory === cat.name && cat.subcategories?.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 top-full mt-1 pt-2 z-[99999] min-w-[240px]"
                >
                  {/* Arrow pointer */}
                  <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
                  <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl shadow-gray-200/50 py-2 overflow-hidden">
                    <div className="px-2 py-1.5 border-b border-gray-100 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-600">Subcategories</span>
                    </div>
                    {cat.subcategories.map((sub, idx) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={`block px-4 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg mx-2 ${
                          location.pathname === sub.path
                            ? 'text-teal-700 bg-teal-50 border-l-2 border-teal-500'
                            : 'text-gray-700 hover:text-teal-700 hover:bg-teal-50/70 border-l-2 border-transparent'
                        }`}
                        onClick={() => setActiveCategory(null)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: accordion - header theme */}
        <div className="md:hidden py-1">
          <button
            type="button"
            onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white/60 hover:bg-white/80 border border-gray-200 rounded-md transition-colors uppercase focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-expanded={isMobileCategoriesOpen}
            aria-controls="mobile-categories"
          >
            <span>Categories</span>
            <svg
              className={`w-5 h-5 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isMobileCategoriesOpen && (
            <div id="mobile-categories" className="mt-2 space-y-1 max-h-[60vh] overflow-y-auto" role="region" aria-label="Product categories">
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="border border-gray-200 rounded-lg overflow-hidden bg-white/60">
                  <Link
                    to={cat.path}
                    className={`block px-4 py-3 text-sm font-medium transition-colors uppercase ${
                      isCategoryActive(cat.path) ? 'text-teal-800 bg-white/80' : 'text-gray-700 hover:text-gray-900 hover:bg-white/70'
                    }`}
                    onClick={() => setIsMobileCategoriesOpen(false)}
                  >
                    {cat.name}
                  </Link>
                  {cat.subcategories?.length > 0 && (
                    <div className="pl-4 pb-2 flex flex-wrap gap-1">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                            location.pathname === sub.path
                              ? 'bg-teal-100 border-teal-300 text-teal-800'
                              : 'bg-white/80 border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-white hover:border-gray-300'
                          }`}
                          onClick={() => setIsMobileCategoriesOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
