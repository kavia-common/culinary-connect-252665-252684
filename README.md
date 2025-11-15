# culinary-connect-252665-252684

This workspace contains the FlavorShare frontend implemented with React and Supabase.

- Container: flavorshare_frontend
- Start: npm start
- Configure env via flavorshare_frontend/.env.example (copy to .env and set values)
- Docs: flavorshare_frontend/README.md

## Supabase schema and storage setup

Use the helper SQL file to provision tables, RLS policies, and storage buckets required by the app.

1) Environment variables (frontend)
- Set in flavorshare_frontend/.env
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY
  - Optional: REACT_APP_FRONTEND_URL (used for email redirect to your app domain)

2) Apply database schema
- Open your Supabase project -> SQL Editor
- Paste and run the contents of: supabase/schema.sql (from this repo)
  - Creates tables: profiles, recipes, tags, recipe_tags, favorites, follows, comments
  - Enables RLS and adds policies for select/insert/update/delete
  - Creates storage buckets: recipe-images and avatars
  - Adds storage policies: public read; authenticated users can write (avatars scoped to userId/ prefix)

3) Minimal seed data
- The schema file includes optional tag seeds (Vegan, Vegetarian, Quick, Dessert, Gluten-free).
- You can insert demo profile/recipe by replacing UUIDs with a real auth.users.id and uncommenting example inserts.

4) Storage behavior
- Buckets created: recipe-images (for recipe photos), avatars (for user avatars)
- Public read is enabled so the app can display images directly via public URLs.
- Writes require an authenticated session.
- Avatars write is scoped so users may only write under "<uid>/" prefix.

5) Notes
- If you prefer private images, remove public read policies in schema.sql and update the app to use signed URLs (not necessary for current setup).