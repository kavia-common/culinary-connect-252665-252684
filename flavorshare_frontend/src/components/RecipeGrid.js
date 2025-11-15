import React from 'react';
import RecipeCard from './recipe/RecipeCard.jsx';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 * Renders recipes either as a responsive grid or as a horizontal scroll row with snap.
 */
export function RecipeGrid({ recipes, layout = 'horizontal' }) {
  /**
   * PUBLIC_INTERFACE
   * layout:
   * - 'horizontal' (default): horizontal scroll row with snap and fixed card width
   * - 'grid': traditional responsive grid
   */
  if (!recipes || recipes.length === 0) {
    return <div style={{ color: '#64748b' }}>No recipes found.</div>;
  }

  if (layout === 'horizontal') {
    // Horizontal scroll row
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
          paddingBottom: 6, // breathing room for shadows
          scrollbarWidth: 'none', // Firefox hide
          msOverflowStyle: 'none', // IE/Edge
        }}
        // Hide scrollbar (WebKit)
        onScroll={(e) => {
          // no-op; hook left for future analytics.
        }}
      >
        {/* Hide scrollbar for WebKit */}
        <style>{`
          /* Hide scrollbar for WebKit-based browsers */
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
              minWidth: 280, // min-w-[280px]
              width: 288, // ~ w-72 (18rem)
              scrollSnapAlign: 'start',
            }}
          >
            <RecipeCard recipe={r} />
          </div>
        ))}
      </div>
    );
  }

  // Fallback grid layout
  return (
    <div
      role="list"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 24, // gap-6
      }}
    >
      {recipes.map((r, idx) => (
        <div
          key={r.id}
          role="listitem"
          className="animate-fadeIn"
          style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
        >
          <RecipeCard recipe={r} />
        </div>
      ))}
    </div>
  );
}
