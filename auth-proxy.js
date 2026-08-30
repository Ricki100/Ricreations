// Server-side authentication proxy to bypass CORS issues
// Deploy this to handle auth requests server-side
// Usage: POST to /api/auth/login with { email, password }

const express = require('express');
const cors = require('cors');
const https = require('https');
const { URL } = require('url');

// Simple HTTPS request helper (replaces node-fetch)
function makeRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: { error: data }, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ftneltjlpiatfkcwougg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bmVsdGpscGlhdGZrY3dvdWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTU2ODcsImV4cCI6MjA1NDI3MTY4N30.ms7fQaiPxSTwQdC0yWgMiiQt5U5eI3wVZVl21qrOMpk';

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const response = await makeRequest(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
    }, { email, password });
    
    const data = response.data;
    
    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json(data);
    }
    
    res.json(data);
  } catch (error) {
    console.error('Auth proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/recover', async (req, res) => {
  try {
    const { email, redirectTo } = req.body;
    
    const response = await makeRequest(
      `${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
      { email }
    );
    
    const data = response.data;
    
    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json(data);
    }
    
    res.json(data);
  } catch (error) {
    console.error('Recovery proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth proxy listening on port ${PORT}`);
});
