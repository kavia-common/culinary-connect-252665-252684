import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

/**
 * PUBLIC_INTERFACE
 * RecipeCard
 * Displays a recipe summary.
 */
export function RecipeCard({ recipe }) {
  /** Card view for a recipe. */
  const cover = recipe?.cover_url || '';
  const authorLabel = recipe?.author?.display_name || recipe?.author?.username || 'Unknown';
  return (
    <article className="card recipe-card">
      <img src={cover} alt={recipe?.title ? `${recipe.title} cover` : 'Recipe image'} />
      <div className="body">
        <div className="title">{recipe?.title || 'Untitled recipe'}</div>
        <div className="meta">
          <span aria-label="Author">👤 {authorLabel}</span>
          <span aria-label="Servings">🍽️ {recipe?.servings || '-'}</span>
          <span aria-label="Time">⏱️ {recipe?.cook_time || '-'}m</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button as={Link} to={`/recipes/${recipe?.id}`} variant="ghost">View</Button>
        </div>
      </div>
    </article>
  );
}
