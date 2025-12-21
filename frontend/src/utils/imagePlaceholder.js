/**
 * Generates a data URI for a placeholder image
 * Works offline - no external requests needed
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display (optional)
 * @returns {string} Data URI string
 */
export const getPlaceholderImage = (width = 300, height = 400, text = 'No Image') => {
  // Create SVG as data URI - works offline
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        fill="#9ca3af" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Pre-defined placeholder images for common sizes
export const placeholders = {
  productList: getPlaceholderImage(300, 400, 'Image Not Available'),
  productDetail: getPlaceholderImage(600, 800, 'Image Not Available'),
  thumbnail: getPlaceholderImage(60, 80, 'No Image'),
  wishlist: getPlaceholderImage(600, 800, 'Image Not Available'),
};

/**
 * Safely gets image URL from product object
 * Handles both object format (image1, image2, image3) and array format
 * @param {Object} product - Product object
 * @param {string} imageKey - Which image to get ('image1', 'image2', 'image3', or first available)
 * @returns {string} Image URL or placeholder
 */
export const getProductImage = (product, imageKey = 'image1') => {
  if (!product || !product.images) {
    return placeholders.productList;
  }

  // Handle object format: { image1: "url", image2: "url" }
  if (typeof product.images === 'object' && !Array.isArray(product.images)) {
    const imageUrl = product.images[imageKey];
    if (imageUrl && typeof imageUrl === 'string') {
      return imageUrl;
    }
    // Fallback to image1 if requested image doesn't exist
    if (imageKey !== 'image1' && product.images.image1) {
      return product.images.image1;
    }
  }

  // Handle array format: [{ url: "url1" }, { url: "url2" }]
  if (Array.isArray(product.images) && product.images.length > 0) {
    const imageIndex = imageKey === 'image1' ? 0 : imageKey === 'image2' ? 1 : imageKey === 'image3' ? 2 : 0;
    const image = product.images[imageIndex];
    if (image) {
      // Handle both { url: "..." } and direct string
      return typeof image === 'string' ? image : (image.url || placeholders.productList);
    }
    // Fallback to first image
    if (product.images[0]) {
      return typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || placeholders.productList);
    }
  }

  return placeholders.productList;
};

