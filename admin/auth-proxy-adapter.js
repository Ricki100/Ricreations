/**
 * Supabase Auth Proxy Adapter
 * 
 * This script patches the Supabase client to use a server-side proxy
 * for authentication, bypassing CORS issues entirely.
 * 
 * Include this script BEFORE admin.js in index.html:
 * <script src="auth-proxy-adapter.js"></script>
 * <script src="admin.js"></script>
 */

(function() {
  'use strict';

  const PROXY_ENABLED = true; // Set to false to disable proxy
  const PROXY_BASE = '/api'; // Where your proxy server is mounted
  
  // Store original Supabase client creation
  const originalCreateClient = window.supabase?.createClient;
  
  if (!originalCreateClient || !PROXY_ENABLED) {
    console.log('Auth proxy adapter: Disabled or Supabase not loaded yet');
    return;
  }

  // Wrap the Supabase client to intercept auth calls
  window.supabase.createClient = function(url, anonKey, options = {}) {
    const client = originalCreateClient.call(this, url, anonKey, options);
    
    console.log('Auth proxy adapter: Wrapping Supabase auth methods');

    // Patch the auth.signInWithPassword method
    const originalSignIn = client.auth.signInWithPassword.bind(client.auth);
    
    client.auth.signInWithPassword = async function(credentials) {
      try {
        // First, try to use the server-side proxy
        console.log('Auth proxy adapter: Using proxy for sign-in');
        
        const response = await fetch(`${PROXY_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Return error in Supabase format
          return {
            data: null,
            error: {
              message: data.error || data.error_description || 'Authentication failed',
              status: response.status,
            },
          };
        }

        // If proxy returned tokens, we need to set them in Supabase session
        // The proxy returns the same format as Supabase, so we can use it directly
        if (data.access_token && data.refresh_token) {
          console.log('Auth proxy adapter: Received tokens, setting session');
          
          // Set the session in the Supabase client
          await client.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });

          return {
            data: {
              user: data.user,
              session: {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                user: data.user,
              },
            },
            error: null,
          };
        }

        return { data, error: null };
      } catch (proxyError) {
        console.warn('Auth proxy adapter: Proxy failed, falling back to direct auth', proxyError);
        
        // Fallback to direct Supabase if proxy fails
        try {
          return await originalSignIn(credentials);
        } catch (directError) {
          return {
            data: null,
            error: {
              message: directError.message || 'Authentication failed. Check your connection.',
            },
          };
        }
      }
    };

    // Patch recovery email method
    const originalRecovery = client.auth.resetPasswordForEmail.bind(client.auth);
    
    client.auth.resetPasswordForEmail = async function(email, options = {}) {
      try {
        console.log('Auth proxy adapter: Using proxy for password recovery');
        
        const redirectTo = options.redirectTo || `${window.location.origin}${window.location.pathname}?reset=1`;
        
        const response = await fetch(`${PROXY_BASE}/auth/recover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            email,
            redirectTo,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            data: null,
            error: {
              message: data.error || data.error_description || 'Recovery email could not be sent',
            },
          };
        }

        return { data, error: null };
      } catch (proxyError) {
        console.warn('Auth proxy adapter: Recovery proxy failed, falling back', proxyError);
        return await originalRecovery(email, options);
      }
    };

    return client;
  };

  console.log('✓ Auth proxy adapter installed. Ready to intercept auth calls.');
})();
