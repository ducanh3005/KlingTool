// Configuration for different environments
const CONFIG = {
    // Development (localhost)
    development: {
        API_BASE_URL: 'http://localhost:3000',
        KLING_API_URL: 'https://api.klingai.com'
    },
    
    // Production - Update this with your actual backend URL
    production: {
        API_BASE_URL: 'https://your-backend-domain.com', // Change this!
        KLING_API_URL: 'https://api.klingai.com'
    }
};

// Auto-detect environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const currentConfig = isDevelopment ? CONFIG.development : CONFIG.production;

// Export for use in other files
window.APP_CONFIG = currentConfig; 