// ---------------------------------------------------------
// CLEAN + CORRECT BACKEND URL HANDLING
// ---------------------------------------------------------

const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL;
};


const API_URL = `${getBackendUrl()}/api`;

// ---------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------

export const fetchProducts = async (category, subcategory = null) => {
  try {
    let url = `${API_URL}/products`;
    const params = new URLSearchParams();
    
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
      params.append('category', subcategory);
    } else if (subcategory) {
      params.append('subcategory', subcategory);
    } else if (category) {
      params.append('category', category);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log("Fetching products from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: errorText,
      });
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    console.log("Products fetched:", data?.length || 0);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array instead of throwing error so page still loads
    return [];
  }
};


export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product details");
  return response.json();
};

// Legacy alias for backward compatibility
export const fetchSarees = fetchProducts;
export const fetchSareeById = fetchProductById;


// ---------------------------------------------------------
// HEADER
// ---------------------------------------------------------

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/header`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  const data = await response.json();
  return data.navigation.categories;
};

export const searchProducts = async (query) => {
  const response = await fetch(`${API_URL}/header/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Failed to search products");
  return response.json();
};


// ---------------------------------------------------------
// AUTH HEADERS
// ---------------------------------------------------------

const authHeaders = () => {
  const token = (() => {
    try {
      return localStorage.getItem("auth_token");
    } catch {
      return null;
    }
  })();
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// ---------------------------------------------------------
// ADDRESS
// ---------------------------------------------------------

export const getMyAddress = async () => {
  const res = await fetch(`${API_URL}/address/me`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch address");
  return res.json();
};

export const saveMyAddress = async (payload) => {
  const res = await fetch(`${API_URL}/address`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to save address");
  return res.json();
};

export const updateAddressById = async (id, payload) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update address");
  return res.json();
};

export const deleteAddressById = async (id) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete address");
  return res.json();
};


// ---------------------------------------------------------
// PAYMENT
// ---------------------------------------------------------

export const createPaymentOrder = async (amount, notes = {}) => {
  const res = await fetch(`${API_URL}/payment/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ amount, currency: "INR", notes }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create payment order");
  return res.json();
};

export const verifyPayment = async (payload) => {
  const res = await fetch(`${API_URL}/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to verify payment");
  return res.json();
};

export const createCODOrder = async () => {
  const res = await fetch(`${API_URL}/payment/cod`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create COD order");
  return res.json();
};

// Payment Gateway
export const createPaymentGatewayOrder = async () => {
  const res = await fetch(`${API_URL}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create payment gateway order");
  return res.json();
};


// ---------------------------------------------------------
// ORDERS
// ---------------------------------------------------------

export const getMyOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const cancelOrder = async (orderId) => {
  const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to cancel order");
  }
  return res.json();
};


// ---------------------------------------------------------
// WISHLIST
// ---------------------------------------------------------

export const getWishlist = async () => {
  const res = await fetch(`${API_URL}/wishlist`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) {
    // Return empty wishlist if not authenticated or error
    if (res.status === 401) return { items: [] };
    throw new Error("Failed to fetch wishlist");
  }
  return res.json();
};

export const addToWishlist = async (productId) => {
  const res = await fetch(`${API_URL}/wishlist/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ productId }),
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Please login to add to wishlist");
    throw new Error("Failed to add to wishlist");
  }
  return res.json();
};

export const removeFromWishlist = async (productId) => {
  const res = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Please login");
    throw new Error("Failed to remove from wishlist");
  }
  return res.json();
};

export const getWishlistCount = async () => {
  try {
    const res = await fetch(`${API_URL}/wishlist/count`, {
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
    });
    if (!res.ok) return { count: 0 };
    const data = await res.json();
    return { count: data.count || 0 };
  } catch {
    return { count: 0 };
  }
};
