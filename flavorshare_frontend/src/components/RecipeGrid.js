import React from 'react';
import RecipeCard from './recipe/RecipeCard.jsx';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 * Renders recipes in a responsive grid:
 * - 1 column on small screens
 * - Exactly 3 columns from md (≥768px) and above
 * Each RecipeCard is a direct child of the grid to ensure proper wrapping.
 */
export function RecipeGrid({ recipes }) {
  /**
   * PUBLIC_INTERFACE
   * Always use a fixed responsive grid: 1/3 columns with wrapping (3 from md up).
   * Horizontal scroll and auto-fit modes are disabled to enforce 3 columns on md+.
   */
  if (!recipes || recipes.length === 0) {
    return <div style={{ color: '#64748b' }}>No recipes found.</div>;
  }

  // Fixed responsive grid layout with explicit classes; prevent any horizontal overflow/scroll snapping/nowrap
  return (
    <div
      role="list"
      aria-label="Recipe list"
      className="animate-fadeIn force-grid grid grid-cols-1 md:grid-cols-3 gap-8 block-full no-overflow-x normal-whitespace"
      style={{
        display: 'grid',
        gap: 32,
        overflowX: 'hidden',
        whiteSpace: 'normal'
      }}
    >
      {/* Each RecipeCard must be a direct child for proper grid placement */}
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
