import React from 'react';
import { RecipeGrid } from '../components/RecipeGrid';
import { recipesApi } from '../lib/api';

/**
 * PUBLIC_INTERFACE
 * Home
 * Public feed of recipes (filters temporarily disabled)
 */
export default function Home() {
  /** Home page showing recipe grid; filters removed per request */
  const [recipes, setRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Load latest recipes
  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // tagId intentionally omitted to disable tag-based filtering from UI
        const res = await recipesApi.list({ page: 1, pageSize: 12, search: '' });
        if (active) setRecipes(res.data || []);
      } catch {
        if (active) setRecipes([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div
      className="bg-[#fafafa]"
      style={{
        background: '#fafafa',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <main>
          {loading ? (
            <div style={{ color: '#475569' }}>Loading...</div>
          ) : (
            <RecipeGrid recipes={recipes} />
          )}
        </main>
      </div>
    </div>
  );
}
