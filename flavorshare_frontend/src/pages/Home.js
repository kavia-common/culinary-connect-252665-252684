import React from 'react';
import { RecipeGrid } from '../components/RecipeGrid';
import { recipesApi } from '../lib/api';

/**
 * PUBLIC_INTERFACE
 * Home (Redesigned)
 * Public feed with hero, subtle controls, and responsive grid.
 */
export default function Home() {
  /** Keep existing fetching logic; present redesigned layout + grid. */
  const [recipes, setRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
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
      style={{
        background: '#fafafa',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Hero */}
      <section
        className="animate-fadeIn"
        style={{
          background:
            'radial-gradient(1200px 400px at 10% -10%, rgba(37,99,235,0.10), transparent), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,1))',
          borderBottom: '1px solid rgba(17,24,39,0.06)',
        }}
      >
        <div className="container" style={{ paddingTop: 28, paddingBottom: 24 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#0f172a' }}>
              Discover delicious recipes
            </h1>
            <p style={{ margin: 0, color: '#475569' }}>
              Fresh ideas from the FlavorShare community — quick meals, cozy dinners, and more.
            </p>
          </div>
          {/* Controls placeholder (future filters/toggles) */}
          <div
            className="transition-all duration-300 ease-out"
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 16,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              style={{
                padding: '8px 12px',
                borderRadius: 9999,
                border: '1px solid rgba(17,24,39,0.08)',
                background: '#ffffff',
                color: '#111827',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'default',
              }}
              aria-disabled="true"
              title="Filters coming soon"
            >
              Popular
            </button>
            <button
              type="button"
              style={{
                padding: '8px 12px',
                borderRadius: 9999,
                border: '1px solid rgba(17,24,39,0.08)',
                background: '#ffffff',
                color: '#111827',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'default',
              }}
              aria-disabled="true"
              title="Filters coming soon"
            >
              Newest
            </button>
            <button
              type="button"
              style={{
                padding: '8px 12px',
                borderRadius: 9999,
                border: '1px solid rgba(17,24,39,0.08)',
                background: '#ffffff',
                color: '#111827',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'default',
              }}
              aria-disabled="true"
              title="Filters coming soon"
            >
              Quick Meals
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        {loading ? (
          <div style={{ color: '#475569' }}>Loading...</div>
        ) : (
          <div
            role="list"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(1, minmax(0, 1fr))',
              gap: 24,
            }}
          >
            {/* Responsive breakpoints via inline media queries */}
            <style>
              {`
                @media (min-width: 768px) {
                  .home-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 1024px) {
                  .home-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (min-width: 1280px) {
                  .home-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
              `}
            </style>
            <div className="home-grid" style={{ display: 'contents' }} />
            {/* Render grid via RecipeGrid to preserve mapping and animations */}
            <RecipeGrid recipes={recipes} />
          </div>
        )}
      </div>
    </div>
  );
}
