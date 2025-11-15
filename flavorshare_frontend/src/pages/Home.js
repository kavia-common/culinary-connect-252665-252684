import React from 'react';
import { RecipeGrid } from '../components/RecipeGrid';
import { recipesApi } from '../lib/api';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';

/**
 * PUBLIC_INTERFACE
 * Home
 * Public feed with hero gradient, filter tabs, and responsive grid or horizontal row.
 */
export default function Home() {
  /** Keep existing fetching logic; present redesigned layout + horizontal row by default. */
  const [recipes, setRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab] = React.useState('popular');

  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // Sorting logic placeholder based on tab; API currently orders by created_at desc by default.
        const res = await recipesApi.list({ page: 1, pageSize: 12, search: '' });
        let data = res.data || [];
        if (tab === 'quick') {
          // naive client filter: cook_time <= 20 if available
          data = data.filter((r) => (r?.cook_time || 999) <= 20);
        }
        // 'popular' and 'newest' currently share default backend ordering; keep as-is
        if (active) setRecipes(data);
      } catch {
        if (active) setRecipes([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [tab]);

  return (
    <div style={{ background: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
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

      {/* Listing */}
      <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        {loading ? (
          // Loading skeletons: emulate horizontal row with fixed-width skeleton cards
          <div
            role="list"
            aria-label="Loading recipes"
            style={{
              display: 'flex',
              gap: 16,
              overflow: 'hidden',
              paddingBottom: 6,
            }}
          >
            {new Array(6).fill(0).map((_, i) => (
              <div
                key={i}
                role="listitem"
                className="card"
                style={{ borderRadius: 16, overflow: 'hidden', minWidth: 280, width: 288, flex: '0 0 auto' }}
              >
                <div className="skeleton" style={{ width: '100%', height: 200 }} />
                <div style={{ padding: 16, display: 'grid', gap: 8 }}>
                  <div className="skeleton" style={{ width: '70%', height: 16 }} />
                  <div className="skeleton" style={{ width: '50%', height: 12 }} />
                  <div className="skeleton" style={{ width: '90%', height: 12 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <section
            role="region"
            aria-label="Recipes"
            className="animate-fadeIn"
            style={{ display: 'grid', gap: 16 }}
          >
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Trending recipes</h2>
              {/* Future toggle could go here to swap between "horizontal" and "grid" */}
            </header>
            <RecipeGrid recipes={recipes} layout="horizontal" />
          </section>
        )}
      </div>
    </div>
  );
}
