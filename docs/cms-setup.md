# Ricreations CMS setup

The public website remains hosted by Hostinger. Supabase provides the database, administrator authentication, and public media delivery.

## 1. Supabase project

The site is connected to the existing Supabase project **Portfolio** (`ftneltjlpiatfkcwougg`). The `create_ricreations_cms` migration has been applied and `rchitagu@gmail.com` has the administrator role.

For a future administrator, create the user under **Authentication → Users**, then replace the email below and run:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'YOUR_EMAIL_ADDRESS';
   ```

5. Sign out and back in after assigning the role so the new JWT contains `app_metadata.role = admin`.
6. Disable public user sign-ups in **Authentication → Providers → Email**. The CMS has no sign-up form, but disabling this is useful defence in depth.

### Authentication URLs and password recovery

In **Authentication → URL Configuration**, set:

- **Site URL:** `https://ricreations.co.za`
- **Redirect URLs:** `https://ricreations.co.za/admin/**` and `http://127.0.0.1:4182/admin/**`

The wildcard allows the CMS to add its `?reset=1` recovery marker. From the CMS sign-in screen, select **Forgot password?**, request a new message, and use only the newest recovery link. Each recovery link is one-time and expires.

Do not put a secret key or `service_role` key anywhere in this repository or in browser code.

## 2. Connect the website

1. Upload the changed website to Hostinger's `public_html` directory.
2. Visit `https://ricreations.co.za/admin/` and sign in as `rchitagu@gmail.com`.

The publishable key is intentionally present in frontend JavaScript. Security comes from the database and Storage RLS policies in `supabase/schema.sql`.

## 3. Publishing workflow

- Create either a **Portfolio project** or **Blog post**.
- Upload one blog cover image directly below the post introduction. It is used as both the homepage thumbnail and the article's main image. Images are limited to 2 MB.
- The separate media panel accepts videos and PDFs up to 15 MB.
- Videos larger than 6 MB use resumable TUS uploads; the bucket accepts files up to 15 MB.
- A draft is visible only to the administrator. Published content appears on the public website.
- Use compressed MP4 (H.264 video and AAC audio) or WebM. Add a cover image so videos do not leave an empty first frame.
- Write article content with simple semantic HTML such as `<h2>`, `<p>`, `<ul>`, `<li>`, `<strong>`, and `<a>`.

## 4. Security and maintenance

- Keep RLS enabled. Do not replace the policies with broad `to authenticated using (true)` policies.
- Add additional editors only after defining an intentional role/ownership model.
- Delete unused media through the Supabase Storage interface; deleting a content item deliberately does not delete its media automatically.
- Review Storage usage periodically. Video will consume bandwidth faster than images.
- Configure custom SMTP before relying on production password-reset emails.
