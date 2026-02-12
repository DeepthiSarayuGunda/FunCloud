/**
 * FunCloud Configuration
 * 
 * Environment-based configuration for API endpoints.
 */

// Get API base URL from environment or window object
function getApiBaseUrl() {
  // Priority 1: Injected at build time via Amplify
  if (window.ENV && window.ENV.API_BASE_URL) {
    return window.ENV.API_BASE_URL;
  }
  
  // Priority 2: Runtime window variable
  if (window.FUNCLOUD_API_URL) {
    return window.FUNCLOUD_API_URL;
  }
  
  // Priority 3: Localhost fallback
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Priority 4: Fail with clear error
  console.error('API_BASE_URL not configured! Set window.ENV.API_BASE_URL or window.FUNCLOUD_API_URL');
  return null;
}

// Configuration object
const CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  
  FEATURES: {
    SEO_ANALYZER: true,
    AI_CHAT: true,
  },
  
  UI: {
    SHOW_LOADING_SPINNER: true,
    CHAT_HISTORY_LIMIT: 50,
    SEO_CACHE_DURATION: 24 * 60 * 60 * 1000,
  }
};

// Export configuration
export default CONFIG;

// Make available globally
window.FUNCLOUD_CONFIG = CONFIG;

// Log configuration (helps debugging)
console.log('FunCloud Config loaded:', {
  apiUrl: CONFIG.API_BASE_URL,
  hostname: window.location.hostname
});
