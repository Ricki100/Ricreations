# Ricreations CMS - CORS Error Fix Guide

## The Problem

**Error in browser console:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading 
the remote resource at https://ftneltjlpiatfkcwougg.supabase.co/auth/v1/token?grant_type=password
(Reason: CORS request did not succeed). Status code: (null).
```

**What's happening:**
Your domain (`ricreations.co.za`) is making a request to a different domain (`ftneltjlpiatfkcwougg.supabase.co`), and browsers block this for security reasons unless both domains explicitly allow it.

---

## Solution 1: Fix CORS in Supabase (Recommended)

This is the easiest and most direct solution.

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in with your account
3. Find and select project `ftneltjlpiatfkcwougg`

### Step 2: Enable CORS for Your Domain
1. Click **Settings** (bottom of left sidebar)
2. Click **CORS** 
3. In the "Allowed Origins" field, add:
   ```
   https://ricreations.co.za
   https://www.ricreations.co.za
   ```
4. If testing locally also add:
   ```
   http://localhost:8080
   http://127.0.0.1:8080
   http://localhost:3000
   ```
5. Click **Save**

### Step 3: Test
1. Wait 30 seconds for changes to propagate
2. Refresh your admin page: https://ricreations.co.za/admin/
3. Try logging in again

**Result:** Should work immediately if CORS is the only issue.

---

## Solution 2: Use Server-Side Auth Proxy (For HTTPS CORS Issues)

If CORS settings are correct but still failing on HTTPS, you can use a server-side proxy to handle authentication server-to-server (no CORS needed).

### Prerequisites
- Node.js 14+ installed on your server
- npm package manager

### Setup

1. **Install dependencies:**
```bash
npm install express cors
```

2. **Create `auth-proxy.js`** (already provided in the project root)

3. **Update `supabase-config.js`** to use the proxy:
```javascript
window.RICREATIONS_SUPABASE = Object.freeze({
  url: 'https://ftneltjlpiatfkcwougg.supabase.co',
  publishableKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bmVsdGpscGlhdGZrY3dvdWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTU2ODcsImV4cCI6MjA1NDI3MTY4N30.ms7fQaiPxSTwQdC0yWgMiiQt5U5eI3wVZVl21qrOMpk',
  mediaBucket: 'cms-media',
  brandSettingsTable: 'blog_brand_settings',
  proxyUrl: '/api',  // Add this to use the proxy
  useProxy: true      // Enable proxy mode
});
```

4. **Update login handler in `admin/admin.js`:**

Find this section:
```javascript
$('#loginForm').addEventListener('submit',async(event)=>{
  // ... existing code ...
  const {error}=await client.auth.signInWithPassword(values);
});
```

Replace with proxy-aware code (see `admin/auth-fallback.js` for the implementation).

5. **Start the proxy server:**
```bash
# Set environment variables
export SUPABASE_URL="https://ftneltjlpiatfkcwougg.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Run the proxy
node auth-proxy.js

# Server now listens on http://localhost:3001
```

6. **Use a reverse proxy** (nginx/Apache) to map `/api` to the proxy server:
```nginx
location /api/ {
  proxy_pass http://localhost:3001/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
```

### How It Works
- Browser → `ricreations.co.za/api/auth/login` (same origin, no CORS)
- Server → `ftneltjlpiatfkcwougg.supabase.co/auth/v1/token` (server-to-server, no CORS)

**Pros:** Works even with strict CORS policies  
**Cons:** Requires running a Node.js server

---

## Solution 3: Use Netlify/Vercel Functions (Zero-Config)

If you host on Netlify or Vercel, you can use serverless functions as auth proxies without setup.

### Netlify Example

1. Create `netlify/functions/auth-login.js`:
```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { email, password } = JSON.parse(event.body);
  
  try {
    const response = await fetch(
      'https://ftneltjlpiatfkcwougg.supabase.co/auth/v1/token?grant_type=password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      }
    );
    
    const data = await response.json();
    return {
      statusCode: response.ok ? 200 : response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

2. Set environment variable in Netlify:
   - Go to Site settings → Build & deploy → Environment
   - Add `SUPABASE_ANON_KEY`

3. Update `supabase-config.js`:
```javascript
proxyUrl: '/.netlify/functions'
```

4. Deploy!

---

## Solution 4: Check Supabase Project Status

Sometimes the error is because Supabase is having issues.

1. Go to [Supabase Status](https://status.supabase.com)
2. Check if there are any ongoing incidents
3. If status is healthy but still failing, try:
   - **Restart project:** Settings → General → Restart Project
   - **Clear browser cache:** DevTools → Application → Clear Storage
   - **Try incognito mode** (to rule out browser extensions)

---

## Debugging Checklist

- [ ] Browser console shows exact CORS error
- [ ] Domain is added to Supabase CORS whitelist
- [ ] Supabase project status is "Active" (not paused)
- [ ] API keys in `supabase-config.js` are correct
- [ ] No browser extensions blocking requests
- [ ] Tried from localhost first (to rule out domain issues)
- [ ] Waited 30+ seconds after changing CORS settings
- [ ] Refreshed browser page (not just F5, but Ctrl+Shift+R)

---

## Testing the Fix

Open browser DevTools (F12) and run:
```javascript
// Test direct Supabase access
fetch('https://ftneltjlpiatfkcwougg.supabase.co/auth/v1/settings', {
  headers: { 'apikey': 'YOUR_KEY_FROM_CONFIG' }
})
.then(r => r.json())
.then(d => console.log('✓ Supabase reachable:', d))
.catch(e => console.log('✗ Error:', e.message))
```

If this works, CORS is configured correctly.

---

## Files Reference

- **Main config:** [`assets/js/supabase-config.js`](../assets/js/supabase-config.js)
- **Admin login:** [`admin/admin.js`](admin.js)
- **Auth proxy server:** [`../auth-proxy.js`](../auth-proxy.js)
- **Auth fallback handler:** [`auth-fallback.js`](auth-fallback.js)

---

## Support

1. **Still seeing CORS error?**
   - Check browser console for exact error message
   - Verify domain is in Supabase CORS whitelist
   - Try accessing from `localhost` first
   - Check if Supabase project is active

2. **Getting different error?**
   - `401 Unauthorized` → Wrong API key
   - `404 Not Found` → Wrong Supabase URL
   - `Connection refused` → Supabase is down
   - `Timeout` → Network is too slow

3. **Need more help?**
   - Share the exact error from browser console
   - Verify Supabase project URL and API key
   - Try the diagnostic page at `/debug-supabase.html`
