// ---------------------------------------------------------
// CLEAN + CORRECT BACKEND URL HANDLING
// ---------------------------------------------------------

import axios from 'axios';

const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL;
};

const API_URL = `${getBackendUrl()}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = (() => {
      try {
        return localStorage.getItem("auth_token");
      } catch {
        return null;
      }
    })();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------

export const fetchProducts = async (category, subcategory = null) => {
  try {
    const params = {};
    
    // Parent categories that should be treated as category, not subcategory
    const parentCategories = [
      'Women Accessories',
      "Women's Accessories",
      'Men Accessories',
      "Men's Accessories",
      "Women's Shoes",
      "Men's Shoes",
      'Women Watches',
      'Men Watches'
    ];
    
    // If subcategory is actually a parent category, treat it as category
    if (subcategory && parentCategories.includes(subcategory)) {
      params.category = subcategory;
    } else if (subcategory) {
      params.subcategory = subcategory;
    } else if (category) {
      params.category = category;
    }
    
    console.log("Fetching products from:", `${API_URL}/products`, params);

    const response = await apiClient.get('/products', { params });
    const data = response.data;
    console.log("Products fetched:", data?.length || 0);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array instead of throwing error so page still loads
    return [];
  }
};


export const fetchProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

// Legacy alias for backward compatibility
export const fetchSarees = fetchProducts;
export const fetchSareeById = fetchProductById;


// ---------------------------------------------------------
// HEADER
// ---------------------------------------------------------

export const fetchCategories = async () => {
  const response = await apiClient.get('/header');
  return response.data.navigation.categories;
};

export const searchProducts = async (query) => {
  const response = await apiClient.get('/header/search', {
    params: { query }
  });
  return response.data;
};


// ---------------------------------------------------------
// ADDRESS
// ---------------------------------------------------------

export const getMyAddress = async () => {
  const response = await apiClient.get('/address/me');
  return response.data;
};

export const saveMyAddress = async (payload) => {
  const response = await apiClient.post('/address', payload);
  return response.data;
};

export const updateAddressById = async (id, payload) => {
  const response = await apiClient.put(`/address/${id}`, payload);
  return response.data;
};

export const deleteAddressById = async (id) => {
  const response = await apiClient.delete(`/address/${id}`);
  return response.data;
};


// ---------------------------------------------------------
// PAYMENT
// ---------------------------------------------------------

export const createPaymentOrder = async (amount, notes = {}) => {
  const response = await apiClient.post('/payment/orders', {
    amount,
    currency: "INR",
    notes
  });
  return response.data;
};

export const verifyPayment = async (payload) => {
  const response = await apiClient.post('/payment/verify', payload);
  return response.data;
};

export const createCODOrder = async () => {
  const response = await apiClient.post('/payment/cod');
  return response.data;
};

// Payment Gateway
export const createPaymentGatewayOrder = async () => {
  const response = await apiClient.post('/payment/create');
  return response.data;
};


// ---------------------------------------------------------
// ORDERS
// ---------------------------------------------------------

export const getMyOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to cancel order";
    throw new Error(errorMessage);
  }
};


// ---------------------------------------------------------
// WISHLIST
// ---------------------------------------------------------

export const getWishlist = async () => {
  try {
    const response = await apiClient.get('/wishlist');
    return response.data;
  } catch (error) {
    // Return empty wishlist if not authenticated or error
    if (error.response?.status === 401) return { items: [] };
    throw new Error("Failed to fetch wishlist");
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await apiClient.post('/wishlist/add', { productId });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Please login to add to wishlist");
    throw new Error("Failed to add to wishlist");
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await apiClient.delete(`/wishlist/remove/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Please login");
    throw new Error("Failed to remove from wishlist");
  }
};

export const getWishlistCount = async () => {
  try {
    const response = await apiClient.get('/wishlist/count');
    return { count: response.data.count || 0 };
  } catch {
    return { count: 0 };
  }
};
