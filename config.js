// Configuration for different environments
const config = {
    // Development (local)
    development: {
        backendUrl: 'http://localhost:3001'
    },
    // Production (deployed)
    production: {
        backendUrl: 'https://your-backend-url.railway.app' // We'll update this after deploying
    }
};

// Detect environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const currentConfig = isDevelopment ? config.development : config.production;

// Export the backend URL
window.BACKEND_URL = currentConfig.backendUrl; 