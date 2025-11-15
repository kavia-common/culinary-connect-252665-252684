# culinary-connect-252665-252684

This workspace contains the FlavorShare frontend implemented with React and Supabase.

- Container: flavorshare_frontend
- Start: npm start
- Configure env via flavorshare_frontend/.env.example (copy to .env and set values)
- Docs: flavorshare_frontend/README.md

## Feature note: Filters UI
- The frontend currently has Filters (tags) disabled/removed from pages. The internal APIs (tagsApi, recipesApi with tagId) remain available for future use, but the UI does not invoke tag-based filtering.

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
- Frontend fallback tags: If your tags table is empty, the UI shows a default set (Breakfast, Lunch, Dinner, Vegan, Dessert, Quick Meals, Healthy, Kids Special) so users can filter client-side immediately.
- Optional: You can seed these defaults into Supabase from the UI:
  - In flavorshare_frontend/src/components/SidebarFilters.js set ENABLE_ADMIN_SEED = true.
  - Start the app, log in, and press “Seed default tags to Supabase” in the Filters card.
  - Turn the flag off afterwards.
- You can insert demo profile/recipe by replacing UUIDs with a real auth.users.id and uncommenting example inserts.

4) Storage behavior
- Buckets created: recipe-images (for recipe photos), avatars (for user avatars)
- Public read is enabled so the app can display images directly via public URLs.
- Writes require an authenticated session.
- Avatars write is scoped so users may only write under "<uid>/" prefix.

5) Notes
- If you prefer private images, remove public read policies in schema.sql and update the app to use signed URLs (not necessary for current setup).