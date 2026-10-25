# CRC Dashboard — Supabase setup

## 1. Create the shared database table
1. Open the Supabase project for CRC.
2. Go to **SQL Editor** and create a new query.
3. Paste and run `supabase/schema.sql`.
4. The script creates one JSONB row for shared dashboard data and restricts access to signed-in users. It starts empty and does not import the old demo/localStorage data.

## 2. Configure the frontend
Set these environment variables in Netlify for the CRC site, then trigger a new deploy:
- `VITE_SUPABASE_URL`: the project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the publishable key

For local development, copy `.env.example` to `.env.local` and fill in the values.

## 3. Create the first admin login
In Supabase, go to **Authentication → Users → Add user** and create/invite `jsuparkit@gmail.com`. Send an invite or password-reset email rather than sharing a password in chat. Set the site's URL and allowed redirect URLs under **Authentication → URL Configuration** to the deployed Netlify site.

## Security notes
- Never put a Supabase service-role/secret key in the frontend or Netlify's `VITE_*` variables.
- The publishable key is intended for browser use; table access is controlled by Row Level Security.
- This initial shared-state design gives signed-in users access to the shared dashboard dataset. Role-specific database permissions should be added before granting access to additional non-admin users.
