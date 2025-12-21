import { Category } from '../models/Category.js';
import { Product } from '../models/product.js';

export const getHeaderData = async (req, res) => {
  try {
    // Get all categories for the navigation
    const categories = await Category.find({}, 'name slug -_id').sort({ name: 1 });

    // Mock data for other header elements
    const headerData = {
      logo: {
        url: '/logo.png',
        alt: 'TickNTrack Logo'
      },
      navigation: {
        categories: categories,
        links: [
          { name: 'Home', url: '/' },
          { name: 'New Arrivals', url: '/new-arrivals' },
          { name: 'Best Sellers', url: '/best-sellers' },
          { name: 'Deals', url: '/deals' },
          { name: 'Contact', url: '/contact' }
        ]
      },
      search: {
        placeholder: 'Search for shoes, watches, and more...',
        suggestions: [
          'Sports Shoes',
          'Running Shoes',
          'Smart Watches',
          'Luxury Watches',
          'Formal Shoes'
        ]
      },
      userLinks: {
        wishlist: { url: '/wishlist', label: 'Wishlist' },
        cart: { url: '/cart', label: 'Cart' },
        account: { url: '/account', label: 'Account' }
      }
    };

    res.json(headerData);
  } catch (error) {
    console.error('Error fetching header data:', error);
    res.status(500).json({ message: 'Error fetching header data', error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.json({ results: [] });
    }

    // Search in products
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'product_info.brand': { $regex: query, $options: 'i' } },
        { 'product_info.shoeMaterial': { $regex: query, $options: 'i' } },
        { 'product_info.watchBrand': { $regex: query, $options: 'i' } },
        { 'product_info.shoeType': { $regex: query, $options: 'i' } },
        { 'product_info.watchType': { $regex: query, $options: 'i' } }
      ]
    }).limit(10).select('title images price mrp discountPercent');

    res.json({ results: products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search', error: error.message });
  }
};
