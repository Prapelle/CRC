# CRC Dashboard — Netlify deployment and build checks

Netlify is the selected hosting platform for this repository.

## Current build settings

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Node.js version: `22`
- SPA fallback: configured in `netlify.toml` and `public/_redirects`

Use the lockfile committed with the project. Do not switch the build command back to a floating `npm install` unless you intentionally regenerate and commit `package-lock.json`.

## Required environment variables

Configure these in the Netlify site settings for the production deploy context, then deploy again:

- `VITE_SUPABASE_URL`: CRC Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: browser-safe publishable key

Never place a Supabase service-role key or secret key in a `VITE_*` variable or client-side source code.

## Troubleshooting a failed build

1. Open the CRC site in the Netlify dashboard and inspect the most recent Deploy log.
2. Confirm the deploy is building the intended branch and the repository root contains `package.json` and `package-lock.json`.
3. Confirm the build command is `npm ci && npm run build`, the publish directory is `dist`, and Node.js is version 22.
4. Re-run the GitHub Actions workflow **Validate CRC Dashboard**. It runs `npm ci`, `npx tsc --noEmit`, and `npm run build`.
5. If dependencies appear stale, use Netlify's **Clear cache and deploy site** option.

## Before promoting the Supabase version

- Run `supabase/schema.sql` in the correct Supabase project's SQL Editor.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Netlify.
- Configure Supabase Authentication's Site URL and allowed redirect URLs to match the actual production Netlify URL.
- Invite the initial Admin account and verify sign-in.
- Test a CSV/Excel import and confirm it persists after reloading and is visible in another signed-in session.

A green frontend build alone does not prove that the Supabase database or authentication settings are configured correctly.
