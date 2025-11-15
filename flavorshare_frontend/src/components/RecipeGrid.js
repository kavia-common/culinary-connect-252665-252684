import React from 'react';
import RecipeCard from './recipe/RecipeCard.jsx';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 * Renders recipes in a responsive grid:
 * - 1 column on small screens
 * - 2 columns on medium (≥640px)
 * - 3 columns on large (≥1024px)
 * Each RecipeCard is a direct child of the grid to ensure proper wrapping.
 */
export function RecipeGrid({ recipes, layout = 'grid' }) {
  /**
   * PUBLIC_INTERFACE
   * layout:
   * - 'grid' (default): responsive 1/2/3 columns with wrapping
   * - 'horizontal': optional horizontal scroll row (disabled by default)
   */
  if (!recipes || recipes.length === 0) {
    return <div style={{ color: '#64748b' }}>No recipes found.</div>;
  }

  if (layout === 'horizontal') {
    // Retain optional horizontal mode if explicitly requested elsewhere
    return (
      <div
        role="list"
        aria-label="Recipe list"
        className="animate-fadeIn"
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 6,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div[aria-label="Recipe list"]::-webkit-scrollbar {
            display: none;
            height: 0;
            width: 0;
            background: transparent;
          }
        `}</style>
        {recipes.map((r, idx) => (
          <div
            key={r.id}
            role="listitem"
            className="animate-fadeIn"
            style={{
              animationDelay: `${Math.min(idx * 40, 240)}ms`,
              flex: '0 0 auto',
              minWidth: 280,
              width: 288,
              scrollSnapAlign: 'start',
            }}
          >
            <RecipeCard recipe={r} />
          </div>
        ))}
      </div>
    );
  }

  // Default responsive grid layout: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
  // Use CSS-in-JS to mimic Tailwind behavior so we don't depend on runtime Tailwind processing.
  return (
    <div
      role="list"
      className="animate-fadeIn"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
        gap: 24, // gap-6
      }}
    >
      <style>{`
        @media (min-width: 640px) {
          div[role="list"].animate-fadeIn {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          div[role="list"].animate-fadeIn {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
      {recipes.map((r, idx) => (
        // Ensure each RecipeCard is a direct child of the grid
        <RecipeCard key={r.id} recipe={r} data-anim-delay={Math.min(idx * 40, 240)} />
      ))}
    </div>
  );
}
