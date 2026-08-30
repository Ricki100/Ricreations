// Enhanced login handler with CORS proxy fallback
// Usage: Replace the login form event listener in admin.js with this

const createAuthHandler = (config = {}) => {
  const PROXY_URL = config.proxyUrl || '/api';
  const USE_PROXY = config.useProxy || false;
  
  return {
    signInWithPassword: async (credentials) => {
      try {
        if (USE_PROXY && window.location.protocol === 'https:') {
          // Try proxy first for HTTPS (CORS most likely to fail)
          return await fetchWithProxy(credentials);
        } else {
          // Try direct Supabase
          return await fetchDirectSupabase(credentials);
        }
      } catch (error) {
        // Fallback to proxy on error
        if (!USE_PROXY) {
          console.warn('Direct auth failed, trying proxy...', error);
          return await fetchWithProxy(credentials);
        }
        throw error;
      }
    }
  };
  
  async function fetchDirectSupabase(credentials) {
    const cfg = window.RICREATIONS_SUPABASE || {};
    const response = await fetch(
      `${cfg.url}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': cfg.publishableKey,
        },
        body: JSON.stringify(credentials),
      }
    );
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || data.message || 'Authentication failed');
    }
    return data;
  }
  
  async function fetchWithProxy(credentials) {
    const response = await fetch(`${PROXY_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.error_description || 'Authentication failed');
    }
    return data;
  }
};

// Example usage in admin.js:
// const authHandler = createAuthHandler({ proxyUrl: '/api' });
// const result = await authHandler.signInWithPassword({ email, password });
