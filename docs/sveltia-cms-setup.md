# Sveltia CMS setup

The CMS is available at `/admin/` and stores content in this GitHub repository.

## First sign-in

1. Open `/admin/` on the deployed website.
2. Choose **Sign in with Token**.
3. Follow Sveltia's link to create a fine-grained GitHub token for `Ricki100/Ricreations` with repository Contents read/write access.
4. Paste the token into Sveltia. It stays in that browser's local storage; never add it to this repository.

## Publishing flow

Sveltia commits posts, projects, settings and media to GitHub. The `Build CMS content` GitHub Action then generates `assets/data/cms-content.json`. Hostinger can pull the resulting commit through its existing Git deployment integration.

If the Action cannot push, enable **Settings → Actions → General → Workflow permissions → Read and write permissions** in the GitHub repository.

## Portable installation

For another website, update `backend.repo` in `admin/config.yml`. Copy `admin/`, `content/`, `scripts/build-cms-content.js`, `.github/workflows/build-cms-content.yml`, `assets/js/cms-public.js`, and the public blog templates. The public templates retain that website's own header, footer and stylesheet.

Sveltia CMS does not require Supabase. GitHub token login is suitable for a single owner or small technical team. For multiple non-technical editors, configure GitHub OAuth with an OAuth client service instead.
