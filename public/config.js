// Configuration for different environments
const config = {
    // For local development
    development: {
        apiBaseUrl: 'http://localhost:3000'
    },
    // For production (replace with your deployed backend URL)
    production: {
        apiBaseUrl: 'https://your-backend-url.vercel.app' // Replace with your actual backend URL
    }
};

// Get current environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const currentConfig = isDevelopment ? config.development : config.production;

// Export configuration
window.API_CONFIG = currentConfig; 