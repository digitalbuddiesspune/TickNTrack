import { Product } from '../models/product.js';

const CATEGORY_GROUPS = {
  'Shoes': [
    'Men\'s Shoes',
    'Women\'s Shoes',
    'Sports Shoes',
    'Casual Shoes',
    'Formal Shoes',
    'Sneakers',
    'Boots',
    'Sandals',
    'Running Shoes',
    'Walking Shoes'
  ],
  'Watches': [
    'Men\'s Watches',
    'Women\'s Watches',
    'Smart Watches',
    'Luxury Watches',
    'Sports Watches',
    'Analog Watches',
    'Digital Watches',
    'Fitness Trackers',
    'Chronograph Watches',
    'Classic Watches'
  ]
};

// Parent category to subcategories mapping - used when querying for parent categories
const PARENT_TO_SUBCATEGORIES = {
  "Men's Shoes": [
    'Men Sports Shoes',
    'Men Casual Shoes',
    'Men Formal Shoes',
    'Men Sneakers',
    'Men Boots',
    'Men Running Shoes'
  ],
  "Women's Shoes": [
    'Women Heels',
    'Women Flats',
    'Women Sneakers',
    'Women Sports Shoes',
    'Women Casual Shoes',
    'Women Sandals'
  ],
  "Child Shoes": [
    'Child School Shoes',
    'Child Sports Shoes',
    'Child Casual Shoes',
    'Child Sandals',
    'Child Sneakers'
  ],
  "Girls Shoes": [
    'Girls School Shoes',
    'Girls Sports Shoes',
    'Girls Casual Shoes',
    'Girls Sandals',
    'Girls Sneakers'
  ],
  "Women Watches": [
    'Women Analog Watches',
    'Women Digital Watches',
    'Women Smart Watches',
    'Women Fitness Trackers',
    'Women Classic Watches'
  ],
  "Men Watches": [
    'Men Analog Watches',
    'Men Digital Watches',
    'Men Smart Watches',
    'Men Sports Watches',
    'Men Luxury Watches',
    'Men Chronograph Watches'
  ],
  "Women Accessories": [
    'Women Belts',
    'Women Goggles',
    'Women Sunglasses',
    'Women Handbags',
    'Women Wallets'
  ],
  "Women's Accessories": [
    'Women Belts',
    'Women Goggles',
    'Women Sunglasses',
    'Women Handbags',
    'Women Wallets'
  ],
  "Men Accessories": [
    'Men Belts',
    'Men Goggles',
    'Men Sunglasses',
    'Men Wallets',
    'Men Caps'
  ],
  "Men's Accessories": [
    'Men Belts',
    'Men Goggles',
    'Men Sunglasses',
    'Men Wallets',
    'Men Caps'
  ]
};

// Helper function to normalize category names (handles variations like "Womens Shoes" vs "Women's Shoes")
const normalizeCategoryName = (name) => {
  if (!name) return '';
  // Handle common variations
  const normalized = name.trim();
  const variations = {
    'Womens Shoes': "Women's Shoes",
    'Mens Shoes': "Men's Shoes",
    'Women Watches': 'Women Watches',
    'Girl Watches': 'Women Watches', // Backward compatibility
    'Men Watches': 'Men Watches',
    'Women Accessories': 'Women Accessories',
    "Women's Accessories": "Women's Accessories",
    'Men Accessories': 'Men Accessories',
    "Men's Accessories": "Men's Accessories"
  };
  return variations[normalized] || normalized;
};

// Helper function to escape special regex characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getProducts = async (req, res) => {
  try {
    // Accept either `subcategory` (preferred) or `category` query param
    const rawCategory = (req.query.subcategory || req.query.category || '').toString();
    // normalize slug-like values (e.g., "soft-silk" -> "soft silk") and trim
    const category = rawCategory.replace(/-/g, ' ').trim();
    let query = {};

    console.log('Received request with query params:', req.query);

    if (category) {
      // Normalize category name to handle variations
      const normalizedCategory = normalizeCategoryName(category);
      
      // Use word boundaries to ensure exact matching and prevent cross-contamination
      // Escape special regex characters in category name
      const escapedCategory = escapeRegex(category);
      const escapedNormalized = escapeRegex(normalizedCategory);
      
      // Use word boundary regex to match exact category names
      // This prevents "Men Watches" from matching "Women Watches"
      const re = new RegExp(`^${escapedCategory}$|\\b${escapedCategory}\\b`, 'i');
      const normalizedRe = normalizedCategory !== category ? new RegExp(`^${escapedNormalized}$|\\b${escapedNormalized}\\b`, 'i') : null;
      
      const orConditions = [
        { 'category.name': { $regex: re } },
        { 'category': { $regex: re } },
        { 'category.slug': { $regex: re } },
        { 'subcategory': { $regex: re } },
        { 'tags': { $regex: re } }
      ];

      // Also add normalized category regex if different
      if (normalizedRe) {
        orConditions.push(
          { 'category.name': { $regex: normalizedRe } },
          { 'category': { $regex: normalizedRe } },
          { 'subcategory': { $regex: normalizedRe } }
        );
      }

      // If this is a parent category, also search for all its subcategories
      if (PARENT_TO_SUBCATEGORIES[normalizedCategory]) {
        PARENT_TO_SUBCATEGORIES[normalizedCategory].forEach((sub) => {
          const escapedSub = escapeRegex(sub);
          const subRe = new RegExp(`^${escapedSub}$|\\b${escapedSub}\\b`, 'i');
          orConditions.push({ category: subRe });
          orConditions.push({ 'category.name': subRe });
          orConditions.push({ subcategory: subRe });
        });
        console.log(`Including subcategories for parent category "${normalizedCategory}":`, PARENT_TO_SUBCATEGORIES[normalizedCategory]);
      }

      // Also check if the original (non-normalized) category is a parent
      if (PARENT_TO_SUBCATEGORIES[category]) {
        PARENT_TO_SUBCATEGORIES[category].forEach((sub) => {
          const escapedSub = escapeRegex(sub);
          const subRe = new RegExp(`^${escapedSub}$|\\b${escapedSub}\\b`, 'i');
          orConditions.push({ category: subRe });
          orConditions.push({ 'category.name': subRe });
          orConditions.push({ subcategory: subRe });
        });
      }

      // Also check if it matches any subcategory name directly (e.g., "Women Heels")
      // This allows direct subcategory matching
      Object.keys(PARENT_TO_SUBCATEGORIES).forEach((parent) => {
        if (PARENT_TO_SUBCATEGORIES[parent].some(sub => 
          sub.toLowerCase() === category.toLowerCase() || 
          category.toLowerCase() === sub.toLowerCase()
        )) {
          // This is a subcategory, make sure we search for it with exact matching
          const escapedSub = escapeRegex(category);
          const subRe = new RegExp(`^${escapedSub}$|\\b${escapedSub}\\b`, 'i');
          orConditions.push({ category: subRe });
          orConditions.push({ 'category.name': subRe });
        }
      });

      if (CATEGORY_GROUPS[category]) {
        CATEGORY_GROUPS[category].forEach((sub) => {
          const escapedSub = escapeRegex(sub);
          const subRe = new RegExp(`^${escapedSub}$|\\b${escapedSub}\\b`, 'i');
          orConditions.push({ category: { $regex: subRe } });
        });
      }

      query = { $or: orConditions };

      console.log('Search query:', JSON.stringify(query, null, 2));
    }

    // Get all products (for debugging)
    const allProducts = await Product.find({});
    console.log(`Total products in database: ${allProducts.length}`);
    
    if (allProducts.length > 0) {
      console.log('Sample product:', {
        _id: allProducts[0]._id,
        title: allProducts[0].title,
        category: allProducts[0].category,
        price: allProducts[0].price
      });
      
      // Log all unique categories in the database
      const categories = [...new Set(allProducts.map(p => 
        p.category ? (typeof p.category === 'string' ? p.category : p.category.name) : 'None'
      ))];
      console.log('All categories in database:', categories);
    }

    // Execute the query
    let products = await Product.find(query);
    console.log(`Found ${products.length} matching products`);

    // Process image URLs to ensure they're absolute
    products = products.map(product => {
      const productObj = product.toObject();
      // Get base URL from environment - use production URL or fallback to localhost for development
      const baseUrl = process.env.BASE_URL || 
                     process.env.BACKEND_URL || 
                     (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
      
      // Helper function to ensure URL is absolute
      const ensureAbsoluteUrl = (url) => {
        if (!url || typeof url !== 'string') return url;
        
        // Already absolute URL (http://, https://, or //)
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
          return url;
        }
        
        // Cloudinary or other CDN URLs (usually already absolute)
        if (url.includes('cloudinary.com') || url.includes('amazonaws.com') || url.includes('cdn')) {
          // If it's missing protocol, add https
          if (!url.startsWith('http')) {
            return `https://${url}`;
          }
          return url;
        }
        
        // Relative URL - prepend baseUrl only if baseUrl is set
        if (baseUrl) {
          return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
        }
        
        // If no baseUrl in production and relative URL, return as-is (assume same domain)
        return url;
      };
      
      // Handle both image structures: array of objects OR object with image1/image2/image3
      if (productObj.images) {
        if (Array.isArray(productObj.images)) {
          // Array structure - convert back to object format for frontend consistency
          const imagesObj = {};
          productObj.images.forEach((img, index) => {
            if (img && img.url) {
              imagesObj[`image${index + 1}`] = ensureAbsoluteUrl(img.url);
            }
          });
          // If array is empty but we have object structure, keep original
          if (Object.keys(imagesObj).length > 0) {
            productObj.images = imagesObj;
          }
        } else if (typeof productObj.images === 'object') {
          // Object structure with image1, image2, image3 - ensure URLs are absolute
          const processedImages = {};
          ['image1', 'image2', 'image3'].forEach(key => {
            if (productObj.images[key]) {
              processedImages[key] = ensureAbsoluteUrl(productObj.images[key]);
            }
          });
          productObj.images = processedImages;
        }
      }
      
      return productObj;
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convert to plain object to modify
    const productObj = product.toObject();
    
    // Get base URL from environment - use production URL or fallback to localhost for development
    const baseUrl = process.env.BASE_URL || 
                   process.env.BACKEND_URL || 
                   (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
    
    // Helper function to ensure URL is absolute
    const ensureAbsoluteUrl = (url) => {
      if (!url || typeof url !== 'string') return url;
      
      // Already absolute URL (http://, https://, or //)
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return url;
      }
      
      // Cloudinary or other CDN URLs (usually already absolute)
      if (url.includes('cloudinary.com') || url.includes('amazonaws.com') || url.includes('cdn')) {
        // If it's missing protocol, add https
        if (!url.startsWith('http')) {
          return `https://${url}`;
        }
        return url;
      }
      
      // Relative URL - prepend baseUrl only if baseUrl is set
      if (baseUrl) {
        return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
      }
      
      // If no baseUrl in production and relative URL, return as-is (assume same domain)
      return url;
    };
    
    // Process image URLs to ensure they're absolute and maintain object structure
    if (productObj.images) {
      if (Array.isArray(productObj.images)) {
        // Array structure - convert back to object format for frontend consistency
        const imagesObj = {};
        productObj.images.forEach((img, index) => {
          if (img && img.url) {
            imagesObj[`image${index + 1}`] = ensureAbsoluteUrl(img.url);
          }
        });
        if (Object.keys(imagesObj).length > 0) {
          productObj.images = imagesObj;
        }
      } else if (typeof productObj.images === 'object') {
        // Object structure with image1, image2, image3 - ensure URLs are absolute
        const processedImages = {};
        ['image1', 'image2', 'image3'].forEach(key => {
          if (productObj.images[key]) {
            processedImages[key] = ensureAbsoluteUrl(productObj.images[key]);
          }
        });
        productObj.images = processedImages;
      }
    }
    
    res.json(productObj);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      message: 'Error fetching product', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
