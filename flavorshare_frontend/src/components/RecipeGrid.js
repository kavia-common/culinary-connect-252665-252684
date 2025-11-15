import React from 'react';
import RecipeCard from './recipe/RecipeCard.jsx';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 */
export function RecipeGrid({ recipes }) {
  /** Grid wrapper for recipe cards with responsive auto-fill layout. */
  if (!recipes || recipes.length === 0) {
    return <div style={{ color: '#64748b' }}>No recipes found.</div>;
  }
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
