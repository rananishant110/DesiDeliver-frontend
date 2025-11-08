// Application Configuration
export const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  
  // Development Configuration
  ENV: process.env.REACT_APP_ENV || 'development',
  DEBUG: process.env.REACT_APP_DEBUG === 'true',
  
  // App Configuration
  APP_NAME: 'DesiDeliver',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  FEATURES: {
    AUTHENTICATION: true,
    PRODUCT_CATALOG: true,
    SHOPPING_CART: true,
    ORDER_MANAGEMENT: true,
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export default config;
