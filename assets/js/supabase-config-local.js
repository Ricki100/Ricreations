// Development environment - use local Supabase instance or proxy
// For production, use the deployed Supabase URL
window.RICREATIONS_SUPABASE = Object.freeze({
  // Check your environment
  url: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'https://ftneltjlpiatfkcwougg.supabase.co'  // Keep production URL even locally - Supabase handles CORS
    : 'https://ftneltjlpiatfkcwougg.supabase.co',
  
  publishableKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bmVsdGpscGlhdGZrY3dvdWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTU2ODcsImV4cCI6MjA1NDI3MTY4N30.ms7fQaiPxSTwQdC0yWgMiiQt5U5eI3wVZVl21qrOMpk',
  
  mediaBucket: 'cms-media',
  brandSettingsTable: 'blog_brand_settings'
});
