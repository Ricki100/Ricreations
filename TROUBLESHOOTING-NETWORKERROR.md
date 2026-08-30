# Ricreations Admin CMS - Troubleshooting NetworkError

## Problem
When accessing `ricreations.co.za/admin` or your local admin panel, you see:
```
NetworkError when attempting to fetch resource.
```

This error occurs when the browser cannot connect to Supabase to authenticate.

---

## Quick Diagnosis Checklist

### 1. **Check Internet Connection**
- [ ] Can you access other websites? (google.com, supabase.com)
- [ ] Are you on a VPN or corporate firewall?
- [ ] Try disabling VPN/proxy and refreshing the page

### 2. **Verify Supabase Configuration**
- [ ] Open `assets/js/supabase-config.js`
- [ ] Check that `url` is a valid Supabase URL format: `https://[project].supabase.co`
- [ ] Check that `publishableKey` starts with `eyJ` (not `YOUR_`)
- [ ] Neither should be empty

Current config:
```javascript
url: 'https://ftneltjlpiatfkcwougg.supabase.co'
publishableKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bmVsdGpscGlhdGZrY3dvdWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTU2ODcsImV4cCI6MjA1NDI3MTY4N30.ms7fQaiPxSTwQdC0yWgMiiQt5U5eI3wVZVl21qrOMpk'
```

### 3. **Check Supabase Project Status**
1. Go to [supabase.com](https://supabase.com)
2. Sign in with your account
3. Look for project `ftneltjlpiatfkcwougg`
4. Verify the status:
   - [ ] Project is **Active** (not paused, suspended, or deleted)
   - [ ] Project is in the correct region
   - [ ] The API URL in Supabase settings matches your config

### 4. **Check CORS Configuration**
Supabase might be blocking requests from your domain.

**If you own ricreations.co.za:**
1. In Supabase Dashboard → Settings → CORS
2. Add your domain to the allowed list:
   - `https://ricreations.co.za`
   - `http://localhost:3000` (for local testing)
   - Or temporarily allow all: `*`

**If you don't control CORS settings:**
- Contact the Supabase project owner
- Ask them to whitelist your domain

### 5. **Test Browser Console for Details**
1. Open your browser's Developer Tools (F12)
2. Go to Console tab
3. Try refreshing the page
4. Look for error messages like:
   - `Failed to fetch` → Network/CORS issue
   - `401 Unauthorized` → Invalid API key
   - `404 Not Found` → Wrong Supabase URL
   - `CORS policy` → Domain not whitelisted

### 6. **Try Local Access**
If accessing `ricreations.co.za/admin` fails, try:
- `http://localhost:8080/admin` (if running locally)
- `http://127.0.0.1:8080/admin`
- Your computer's local IP: `http://192.168.1.xxx:8080/admin`

Different domains may have different CORS rules.

---

## Solutions

### **Solution A: Update Supabase Configuration**
If your Supabase project URL or key changed:

1. Open [supabase.com](https://supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the **Project URL** and **anon public key**
5. Update `assets/js/supabase-config.js`:
```javascript
window.RICREATIONS_SUPABASE = Object.freeze({
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  publishableKey: 'eyJ...',  // Your anon key
  mediaBucket: 'cms-media',
  brandSettingsTable: 'blog_brand_settings'
});
```

### **Solution B: Enable CORS for Your Domain**
1. Go to Supabase Dashboard
2. Settings → CORS
3. Add your domain(s):
```
https://ricreations.co.za
https://www.ricreations.co.za
http://localhost:*
http://127.0.0.1:*
```
4. Click Save

### **Solution C: Restart Your Supabase Project**
If CORS settings are correct but still failing:
1. In Supabase Dashboard
2. Settings → General
3. Scroll to "Restart Project" and click Restart
4. Wait 2-3 minutes
5. Refresh the admin page

### **Solution D: Check Database Tables Exist**
The admin panel requires these tables:
- `content_items` — Blog posts and projects
- `blog_brand_settings` — Branding colors

If they don't exist, create them:

**Create content_items:**
```sql
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body_html TEXT,
  cover_url TEXT,
  type TEXT DEFAULT 'blog', -- 'blog' or 'project'
  status TEXT DEFAULT 'draft', -- 'draft' or 'published'
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 100,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Create blog_brand_settings:**
```sql
CREATE TABLE blog_brand_settings (
  id TEXT PRIMARY KEY,
  brand_name TEXT DEFAULT 'Ricreations',
  theme_mode TEXT DEFAULT 'dark',
  light_background TEXT DEFAULT '#f6f4ef',
  light_text TEXT DEFAULT '#0b0b0b',
  light_link TEXT DEFAULT '#1710a5',
  dark_background TEXT DEFAULT '#0c0f12',
  dark_text TEXT DEFAULT '#f4f5f6',
  dark_link TEXT DEFAULT '#a894ff',
  updated_at TIMESTAMP DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
```

### **Solution E: Verify User Permissions (RLS)**
If login fails even with correct credentials:
1. In Supabase → SQL Editor
2. Run: `SHOW row_level_security;`
3. If RLS is enabled, check that your user has the `admin` role:
```sql
UPDATE auth.users 
SET app_metadata = jsonb_set(app_metadata, '{role}', '"admin"')
WHERE email = 'your-email@example.com';
```

---

## Advanced: Run Diagnostics

Open `/debug-supabase.html` in your browser to run automated tests:
1. Navigate to `https://ricreations.co.za/debug-supabase.html`
2. Click "Run All Diagnostics"
3. Check each test result:
   - ✅ Configuration loaded
   - ✅ URL is reachable
   - ✅ Auth endpoint responds
   - ✅ Supabase client created

If any test fails, the reason is shown.

---

## Still Stuck?

**Check browser console for the exact error:**
```javascript
// Open DevTools (F12) → Console
// Try this command:
fetch('https://ftneltjlpiatfkcwougg.supabase.co/auth/v1/settings', {
  headers: { 'apikey': 'YOUR_KEY_FROM_CONFIG' }
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.log('Error:', e.message))
```

**Common error messages and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to fetch` | Network/CORS blocked | Check CORS settings, test from localhost |
| `401 Unauthorized` | Invalid API key | Update `supabase-config.js` with correct key |
| `Connection refused` | Supabase down | Check [supabase.com](https://supabase.com) status |
| `CORS policy` | Domain not allowed | Add domain to Supabase CORS whitelist |
| `Invalid Project` | Wrong URL/project | Verify project ID in `supabase-config.js` |

---

## File References
- Configuration: [`assets/js/supabase-config.js`](assets/js/supabase-config.js)
- Admin code: [`admin/admin.js`](admin/admin.js)
- Diagnostics: [`debug-supabase.html`](debug-supabase.html)
- Database schema: [`supabase/schema.sql`](supabase/schema.sql)

---

## Next Steps
1. Go through the **Checklist** above
2. Try **Solution A** first (update config)
3. If that doesn't work, try **Solution B** (enable CORS)
4. If still failing, run the **Diagnostics** to identify the exact issue

Let me know which error you see in the browser console and I can provide more specific help!
