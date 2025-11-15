import React from 'react';
import RecipeCard from './recipe/RecipeCard.jsx';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 * Renders recipes in a responsive grid:
 * - 1 column on small screens
 * - Exactly 3 columns from md (≥768px) and above
 * Supports optional image-only mode (no captions, no text).
 */
export function RecipeGrid({ recipes, mode = 'default' }) {
  /**
   * PUBLIC_INTERFACE
   * Always use a fixed responsive grid: 1/3 columns with wrapping (3 from md up).
   * Horizontal scroll and auto-fit modes are disabled to enforce 3 columns on md+.
   */
  if (!recipes || recipes.length === 0) {
    return <div style={{ color: '#64748b' }}>No recipes found.</div>;
  }

  const isImageOnly = mode === 'image-only';

  // Fixed responsive grid layout with explicit classes; prevent any horizontal overflow/scroll snapping/nowrap
  return (
    <div
      role="list"
      aria-label={isImageOnly ? 'Recipe images' : 'Recipe list'}
      className={`animate-fadeIn force-grid grid grid-cols-1 md:grid-cols-3 ${isImageOnly ? 'gap-6' : 'gap-8'} block-full no-overflow-x normal-whitespace`}
      style={{
        display: 'grid',
        gap: isImageOnly ? 24 : 32,
        overflowX: 'hidden',
        whiteSpace: 'normal'
      }}
    >
      {/* Each item must be a direct child for proper grid placement */}
      {recipes.map((r, idx) => {
        if (isImageOnly) {
          const img =
            r?.image ||
            r?.cover_url ||
            r?.imageUrl ||
            'https://placehold.co/600x450?text=Recipe';
          return (
            <div
              key={r.id || idx}
              role="listitem"
              className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={img}
                alt={r?.title || 'Recipe image'}
                className="block w-full"
                style={{
                  width: '100%',
                  height: 192, // h-48 approx, 4:3 crop look
                  objectFit: 'cover',
                  display: 'block',
                }}
                loading="lazy"
              />
            </div>
          );
        }
        return (
          <div
            key={r.id}
            role="listitem"
            className="animate-fadeIn"
            style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
          >
            <RecipeCard recipe={r} />
          </div>
        );
      })}
    </div>
  );
}
