import React from 'react';
import { RecipeCard } from './RecipeCard';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 */
export function RecipeGrid({ recipes }) {
  /** Grid wrapper for recipe cards */
  if (!recipes || recipes.length === 0) {
    return <div>No recipes found.</div>;
  }
  return (
    <div className="recipe-grid" role="list">
      {recipes.map(r => (
        <div key={r.id} role="listitem">
          <RecipeCard recipe={r} />
        </div>
      ))}
    </div>
  );
}
