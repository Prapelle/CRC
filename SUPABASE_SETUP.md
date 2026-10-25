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
- The current SQL policy permits every authenticated account to read and update the shared dashboard payload. The frontend's role-based navigation is not a database authorization boundary.
- Before inviting non-admin staff, design and enforce database permissions for each role. Until then, only the initial Admin account should be created.
- The initial Admin role is assigned when the email matches `jsuparkit@gmail.com`. Other users default to Sales unless a trusted administrator sets `app_metadata.role`; do not use user-editable `user_metadata.role` to grant privileges.
- The `app_metadata` role is managed through trusted administrative/server-side tooling, never through a browser client or a service-role key exposed in frontend code.
