# Ricreations CMS - Server-Side Auth Proxy Setup Guide

## Problem Solved ✓

The CORS error when trying to login is now bypassed using a **server-side authentication proxy**. This means:
- ✅ No browser CORS errors
- ✅ Authentication handled server-to-server
- ✅ Works on HTTPS (ricreations.co.za) and localhost

---

## How It Works

```
┌──────────────────┐
│    Browser       │
│  (ricreations    │ ──HTTP──→ /api/auth/login
│    .co.za)       │
└──────────────────┘

┌──────────────────────────────────────┐
│  Your Web Server (Express Proxy)     │
│  Port 3001                           │ ──HTTPS──→ Supabase
│  /api/auth/login                     │            (server-to-server)
└──────────────────────────────────────┘
```

No CORS needed because:
- Browser → Your server: **Same origin** (no CORS)
- Your server → Supabase: **Server-to-server** (no CORS)

---

## Installation

### Option 1: Deploy to Your Server (Recommended for Production)

#### Step 1: Install Dependencies

```bash
# SSH into your server and navigate to the project directory
cd /path/to/ricreations-website

# Install Node.js dependencies
npm install
```

#### Step 2: Set Environment Variables

```bash
# Option A: Using environment variables
export SUPABASE_URL="https://ftneltjlpiatfkcwougg.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bmVsdGpscGlhdGZrY3dvdWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTU2ODcsImV4cCI6MjA1NDI3MTY4N30.ms7fQaiPxSTwQdC0yWgMiiQt5U5eI3wVZVl21qrOMpk"
export PORT=3001

# Option B: Create a .env file
echo 'SUPABASE_URL=https://ftneltjlpiatfkcwougg.supabase.co' > .env
echo 'SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' >> .env
echo 'PORT=3001' >> .env
```

#### Step 3: Start the Proxy Server

```bash
# Start the proxy
npm start

# Or use a process manager for production
npm install -g pm2
pm2 start auth-proxy.js --name "ricreations-auth-proxy"
pm2 save
```

#### Step 4: Configure Reverse Proxy (nginx/Apache)

**For nginx** (`/etc/nginx/sites-available/ricreations.co.za`):
```nginx
server {
    server_name ricreations.co.za www.ricreations.co.za;

    # ... existing SSL/static config ...

    # Proxy auth API to Node.js server
    location /api/auth/ {
        proxy_pass http://localhost:3001/api/auth/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**For Apache** (`.htaccess`):
```apache
RewriteRule ^api/auth/(.*)$ http://localhost:3001/api/auth/$1 [P,L]
```

#### Step 5: Restart Web Server

```bash
# For nginx
sudo systemctl restart nginx

# For Apache
sudo systemctl restart apache2
```

#### Step 6: Test

1. Open your browser to `https://ricreations.co.za/admin`
2. You should see the login page
3. Enter your email and password
4. Check browser DevTools console for `✓ Auth proxy adapter installed`

**Expected Console Output:**
```
✓ Auth proxy adapter installed. Ready to intercept auth calls.
Auth proxy adapter: Using proxy for sign-in
Auth proxy adapter: Received tokens, setting session
```

---

### Option 2: Quick Local Testing (Development Only)

#### Step 1: Install Dependencies Locally

```bash
# Navigate to project root
cd /path/to/ricreations-website

# Install dependencies
npm install
```

#### Step 2: Start Proxy on Localhost

```bash
# Start on port 3001
npm start

# You should see:
# Auth proxy listening on port 3001
```

#### Step 3: Start a Local Web Server

In a different terminal:
```bash
# Start a simple HTTP server in the project directory
# Using Python 3:
python -m http.server 8000

# Or using Node.js:
npx http-server
```

#### Step 4: Access Admin

Open browser to: `http://localhost:8000/admin/index.html`

---

## Troubleshooting

### Issue: "Cannot find module 'express'"

**Fix:** Install dependencies
```bash
npm install
```

### Issue: "Port 3001 already in use"

**Fix:** Use a different port
```bash
PORT=3002 npm start
```

### Issue: Console shows "Proxy failed, falling back to direct auth"

**Fix:** Proxy failed but it's trying direct Supabase. Check:
1. Is proxy server running? (`npm start`)
2. Are env variables set correctly?
3. Check logs: `console.log('Auth proxy error:', error)`

### Issue: Still getting CORS error after setup

**Fix:** Make sure:
1. ✅ `auth-proxy-adapter.js` is loaded BEFORE `admin.js` in index.html
2. ✅ Proxy server is running (`npm start`)
3. ✅ Nginx/Apache reverse proxy is configured correctly
4. ✅ No browser cache issues (F12 → Application → Clear Storage)

---

## Files Modified

| File | Change |
|------|--------|
| `admin/index.html` | Added proxy adapter script tag |
| `admin/auth-proxy-adapter.js` | ✨ NEW - Patches Supabase client to use proxy |
| `auth-proxy.js` | ✨ NEW - Server-side proxy server (Express) |
| `package.json` | ✨ NEW - Node.js dependencies |

---

## Architecture

```
┌─────────────────────────────────────┐
│  Browser (ricreations.co.za/admin)  │
│  ┌─────────────────────────────────┐│
│  │ admin/index.html                ││
│  │ ├─ supabase-config.js           ││
│  │ ├─ auth-proxy-adapter.js ←──┐   ││
│  │ │  (intercepts auth calls) │   ││
│  │ └─ admin.js                 │   ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
                  ↓ (HTTP)
        /api/auth/login
                  ↓
┌─────────────────────────────────────┐
│  Your Server (Reverse Proxy)        │
│  nginx/Apache                       │
│  ┌─────────────────────────────────┐│
│  │ /api/auth/* → localhost:3001    ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
                  ↓ (HTTPS)
┌─────────────────────────────────────┐
│  Express Auth Proxy Server          │
│  (auth-proxy.js)                    │
│  ├─ POST /auth/login                │
│  └─ POST /auth/recover              │
└─────────────────────────────────────┘
                  ↓ (HTTPS)
┌─────────────────────────────────────┐
│  Supabase                           │
│  ftneltjlpiatfkcwougg.supabase.co   │
└─────────────────────────────────────┘
```

---

## Security Notes

⚠️ **Important:** Keep these secure:
- `SUPABASE_ANON_KEY` should be in environment variables, not in code
- The proxy only exposes `/api/auth/*` endpoints (see nginx config)
- HTTPS is required for production
- Consider rate limiting on the proxy to prevent brute force attacks

---

## Next Steps

1. **Install dependencies:** `npm install`
2. **Set environment variables** (SUPABASE_URL, SUPABASE_ANON_KEY)
3. **Start proxy:** `npm start`
4. **Configure reverse proxy** (nginx or Apache)
5. **Restart web server**
6. **Test login** at ricreations.co.za/admin

## Support

If you encounter issues:
1. Check browser console (DevTools F12)
2. Check server logs: `tail -f /var/log/auth-proxy.log`
3. Verify environment variables: `printenv | grep SUPABASE`
4. Test proxy directly: `curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test"}'`
