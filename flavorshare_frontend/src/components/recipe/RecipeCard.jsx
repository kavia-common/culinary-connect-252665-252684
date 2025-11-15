import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, Users, Star, ChefHat } from 'lucide-react';

/**
 * PUBLIC_INTERFACE
 * RecipeCard (Refined)
 * A structured card with consistent image sizing, compact info row, improved hierarchy,
 * and a footer section housing the View Recipe button. Preserves hover scale and image zoom effects.
 */
export default function RecipeCard({ recipe }) {
  /** Render refined recipe card with safe fallbacks and consistent layout. */
  const img =
    recipe?.image ||
    recipe?.cover_url ||
    recipe?.imageUrl ||
    '/api/placeholder/400/250';

  // Author/Avatar
  const authorName =
    recipe?.author?.display_name ||
    recipe?.author?.username ||
    recipe?.author_username ||
    'Unknown';
  const avatarUrl =
    recipe?.author?.avatar_url ||
    recipe?.author?.avatar ||
    '/api/placeholder/32/32';

  // Meta
  const time = recipe?.cook_time || recipe?.totalTime || null;
  const servings = recipe?.servings || null;
  // Rating optional; if not present keep space consistent
  const rating = typeof recipe?.rating === 'number' ? recipe.rating : null;

  // Keep any existing badges; align top-right (meal_type/difficulty)
  const mealType = recipe?.meal_type || null;
  const difficulty = recipe?.difficulty || null;

  // Hover handlers
  function onCardOver(e) {
    e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.10)';
  }
  function onCardOut(e) {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
  }
  function onImgOver(e) {
    e.currentTarget.style.transform = 'scale(1.10)';
  }
  function onImgOut(e) {
    e.currentTarget.style.transform = 'scale(1.0)';
  }

  return (
    <article
      className="group fade-in"
      style={{
        background: '#ffffff',
        border: '1px solid #f1f5f9', // border-gray-100
        borderRadius: 16, // rounded-2xl
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)', // shadow-sm
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        transform: 'translateZ(0)',
      }}
      onMouseOver={onCardOver}
      onMouseOut={onCardOut}
    >
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={img}
          alt={recipe?.title ? `${recipe.title} cover` : 'Recipe image'}
          className="group-hover:scale-110 transition-transform duration-500"
          style={{
            width: '100%',
            height: 192, // h-48
            objectFit: 'cover',
            display: 'block',
            borderTopLeftRadius: 16, // rounded-t-2xl
            borderTopRightRadius: 16,
            transform: 'scale(1.0)',
          }}
          onMouseOver={onImgOver}
          onMouseOut={onImgOut}
        />

        {(mealType || difficulty) && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(37,99,235,0.10)',
              color: '#1e40af',
              border: '1px solid rgba(37,99,235,0.20)',
              backdropFilter: 'saturate(140%) blur(2px)',
            }}
          >
            {mealType || difficulty}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {/* Title and description */}
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }} className="mb-2">
          {recipe?.title || 'Untitled recipe'}
        </h2>
        {recipe?.description && (
          <p style={{ margin: 0, color: '#4b5563' }} className="mb-4">
            {recipe.description}
          </p>
        )}

        {/* Compact info row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Left: author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <img
              src={avatarUrl}
              alt={`${authorName} avatar`}
              width={28}
              height={28}
              style={{
                borderRadius: 9999,
                border: '1px solid rgba(17,24,39,0.08)',
                objectFit: 'cover',
                flex: '0 0 auto',
              }}
            />
            <div style={{ display: 'grid', lineHeight: 1.1 }}>
              <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {authorName}
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ChefHat size={14} /> Creator
                </span>
              </span>
            </div>
          </div>

          {/* Right: time and rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#475569', fontSize: 13 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Clock3 size={16} /> {time ? `${time}m` : '—'}
            </span>
            {typeof servings === 'number' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} /> {servings}
              </span>
            )}
            {rating !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" /> {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Footer with button */}
        <div className="mt-4" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <Link
            to={`/recipes/${recipe?.id}`}
            className="transition-colors"
            style={{
              width: '100%',
              display: 'inline-block',
              textAlign: 'center',
              background: '#f97316', // bg-orange-500
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: 10, // rounded-lg
              fontWeight: 600,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#ea580c')} // hover:bg-orange-600
            onMouseOut={(e) => (e.currentTarget.style.background = '#f97316')}
            aria-label={`View recipe ${recipe?.title || ''}`}
          >
            View Recipe
          </Link>
        </div>
      </div>
    </article>
  );
}
