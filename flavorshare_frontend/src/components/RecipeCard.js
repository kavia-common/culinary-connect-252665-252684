import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

/**
 * PUBLIC_INTERFACE
 * RecipeCard
 * Displays a recipe summary.
 */
export function RecipeCard({ recipe }) {
  /** Card view for a recipe with modern visuals and interactions. */
  const cover = recipe?.cover_url || '';
  // Prefer display_name, then username from author, then fallback to author_username field, else 'Unknown'
  const authorLabel =
    (recipe?.author && (recipe.author.display_name || recipe.author.username)) ||
    recipe?.author_username ||
    'Unknown';

  function getMealBadgeStyles(type) {
    // Map meal types to pastel color styles
    const map = {
      Breakfast: {
        bg: 'rgba(59,130,246,0.12)',
        color: '#1d4ed8',
        border: '1px solid rgba(59,130,246,0.25)',
      },
      Lunch: {
        bg: 'rgba(16,185,129,0.12)',
        color: '#047857',
        border: '1px solid rgba(16,185,129,0.25)',
      },
      Dinner: {
        bg: 'rgba(234,179,8,0.16)',
        color: '#92400e',
        border: '1px solid rgba(234,179,8,0.28)',
      },
      Snacks: {
        bg: 'rgba(249,115,22,0.12)',
        color: '#c2410c',
        border: '1px solid rgba(249,115,22,0.25)',
      },
    };
    const def = map[type] || map.Dinner;
    return {
      background: def.bg,
      color: def.color,
      border: def.border,
    };
  }

  const mealType = recipe?.meal_type || 'Dinner';

  return (
    <article
      className="group animate-fadeIn"
      style={{
        background: '#ffffff',
        border: '1px solid #f3f4f6',
        borderRadius: 16, // rounded-2xl
        boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transform: 'translateZ(0)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.12)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.06)';
      }}
    >
      {/* Image wrapper with badge */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: 200, // h-[200px]
          background: '#e5e7eb',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt={recipe?.title ? `${recipe.title} cover` : 'Recipe image'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1)',
              transition: 'transform 400ms ease',
              display: 'block',
            }}
            className="card-image"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%' }} />
        )}

        {/* Tag badge */}
        {mealType && (
          <div
            aria-label="Meal type"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '6px 10px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              ...getMealBadgeStyles(mealType),
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            {mealType}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 14, display: 'grid', gap: 8 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.3,
          }}
        >
          {recipe?.title || 'Untitled recipe'}
        </h3>

        <div
          className="transition-all duration-300 ease-out"
          style={{
            fontSize: 14,
            color: '#475569',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span aria-label="Author">👤 {authorLabel}</span>
          <span aria-label="Servings">🍽️ {recipe?.servings || '-'}</span>
          <span aria-label="Time">⏱️ {recipe?.cook_time || '-'}m</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <Button
            as={Link}
            to={`/recipes/${recipe?.id}`}
            variant="primary"
            className="transition-all duration-300 ease-out"
            style={{
              background: '#2563EB',
              borderColor: 'rgba(37,99,235,0.2)',
              color: '#fff',
              borderRadius: 15, // rounded-[15px]
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#1e40af'; // hover:bg-blue-700
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#2563EB';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            }}
          >
            View
          </Button>
        </div>
      </div>
    </article>
  );
}
