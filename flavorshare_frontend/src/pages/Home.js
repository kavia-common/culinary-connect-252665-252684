import React from 'react';
import { recipesApi } from '../lib/api';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';

/**
 * PUBLIC_INTERFACE
 * Home
 * Public feed with hero gradient, filter tabs, and responsive image-only gallery grid.
 */
export default function Home() {
  /** Keep existing fetching logic; present image-only grid by default. */
  const [recipes, setRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab] = React.useState('popular');

  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await recipesApi.list({ page: 1, pageSize: 12, search: '' });
        let data = res.data || [];
        if (tab === 'quick') {
          data = data.filter((r) => (r?.cook_time || 999) <= 20);
        }
        if (active) setRecipes(data);
      } catch {
        if (active) setRecipes([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [tab]);

  // Helper to derive best image URL with fallback placeholder
  function getImageUrl(recipe) {
    return (
      recipe?.image ||
      recipe?.cover_url ||
      recipe?.imageUrl ||
      'https://placehold.co/600x450?text=Recipe'
    );
  }

  return (
    <div className="block-full" style={{ background: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero */}
      <section
        className="animate-fadeIn"
        style={{
          background: 'linear-gradient(180deg, rgba(255,107,53,0.12), rgba(255,61,0,0.08))',
          borderBottom: '1px solid rgba(17,24,39,0.06)',
        }}
      >
        <div className="container" style={{ paddingTop: 32, paddingBottom: 28 }}>
          <div style={{ display: 'grid', gap: 10, textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: '#0f172a' }}>
              Cook something wonderful today
            </h1>
            <p style={{ margin: 0, color: '#475569' }}>
              Handpicked recipes from the FlavorShare community. Quick, cozy, and delicious.
            </p>
          </div>

          <div style={{ marginTop: 16 }}>
            <SearchBar />
          </div>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <FilterTabs value={tab} onChange={setTab} />
          </div>
        </div>
      </section>

      {/* Image-only Gallery */}
      <div className="container" style={{ paddingTop: 20, paddingBottom: 40, overflowX: 'hidden' }}>
        {loading ? (
          // Loading skeletons: image-only placeholders in fixed 1/3 layout
          <div
            role="list"
            aria-label="Loading recipes"
            className="force-grid grid grid-cols-1 md:grid-cols-3 gap-6 block-full normal-whitespace"
            style={{ display: 'grid', gap: 24, overflowX: 'hidden', whiteSpace: 'normal' }}
          >
            {new Array(6).fill(0).map((_, i) => (
              <div
                key={i}
                role="listitem"
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="skeleton" style={{ width: '100%', height: 192 }} />
              </div>
            ))}
          </div>
        ) : (
          <section
            role="region"
            aria-label="Recipes image gallery"
            className="animate-fadeIn block-full"
            style={{ display: 'grid', gap: 12 }}
          >
            {/* The gallery grid: images are direct children */}
            <div
              className="force-grid grid grid-cols-1 md:grid-cols-3 gap-6 no-overflow-x normal-whitespace"
              style={{ display: 'grid', gap: 24, overflowX: 'hidden', whiteSpace: 'normal' }}
            >
              {recipes.map((recipe, idx) => (
                <div
                  key={recipe.id || idx}
                  className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
                  role="listitem"
                >
                  <img
                    src={getImageUrl(recipe)}
                    alt={recipe?.title || 'Recipe image'}
                    className="block w-full"
                    style={{
                      width: '100%',
                      height: 192, // ~ h-48 to approximate 4:3 crop for typical widths
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
