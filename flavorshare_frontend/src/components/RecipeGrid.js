import React from 'react';
import RecipeCard from './recipe/RecipeCard.jsx';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 * Renders recipes in a responsive grid:
 * - 1 column on small screens
 * - 2 columns on medium (≥768px)
 * - Exactly 3 columns from large (≥1024px) and above
 * Each RecipeCard is a direct child of the grid to ensure proper wrapping.
 */
export function RecipeGrid({ recipes }) {
  /**
   * PUBLIC_INTERFACE
   * Always use a fixed responsive grid: 1/2/3 columns with wrapping.
   * Horizontal scroll and auto-fit modes are disabled to enforce 3 columns on desktop.
   */
  if (!recipes || recipes.length === 0) {
    return <div style={{ color: '#64748b' }}>No recipes found.</div>;
  }

  // Fixed responsive grid layout: 1 col mobile, 2 cols on md (≥768px), 3 cols on lg+ (≥1024px)
  return (
    <div
      role="list"
      aria-label="Recipe list"
      className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6"
      style={{
        display: 'grid',
        gap: 24
      }}
    >
      {/* Each RecipeCard must be a direct child for proper grid placement */}
      {recipes.map((r, idx) => (
        <div key={r.id} role="listitem" className="animate-fadeIn" style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}>
          <RecipeCard recipe={r} />
        </div>
      ))}
    </div>
  );
}
