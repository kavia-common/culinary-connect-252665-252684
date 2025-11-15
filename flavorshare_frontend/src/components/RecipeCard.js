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
  // Prefer display_name, then username from author, then fallback to author_username field, else 'Unknown'
  const authorLabel =
    (recipe?.author && (recipe.author.display_name || recipe.author.username)) ||
    recipe?.author_username ||
    'Unknown';
  return (
    <article className="card recipe-card">
      <img src={cover} alt={recipe?.title ? `${recipe.title} cover` : 'Recipe image'} />
      <div className="body">
        <div className="title">{recipe?.title || 'Untitled recipe'}</div>
        <div className="meta">
          <span aria-label="Author">👤 {authorLabel}</span>
          <span aria-label="Servings">🍽️ {recipe?.servings || '-'}</span>
          <span aria-label="Time">⏱️ {recipe?.cook_time || '-'}m</span>
          {recipe?.meal_type && (
            <span
              aria-label="Meal type"
              className="meal-badge"
              style={{
                marginLeft: 'auto',
                background: 'rgba(37,99,235,0.08)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(37,99,235,0.25)',
                padding: '2px 8px',
                borderRadius: '999px'
              }}
            >
              {recipe.meal_type}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button as={Link} to={`/recipes/${recipe?.id}`} variant="ghost">View</Button>
        </div>
      </div>
    </article>
  );
}
