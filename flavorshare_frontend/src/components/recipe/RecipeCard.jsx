import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock3, Users, Star, ChefHat } from 'lucide-react';

/**
 * PUBLIC_INTERFACE
 * RecipeCard
 * Modern card with image skeleton, compact author row, structured stats with icons,
 * color-coded difficulty badge, and consistent footer button.
 */
export default function RecipeCard({ recipe }) {
  /** Render refined recipe card with safe fallbacks and consistent layout. */
  const navigate = useNavigate();
  const img =
    recipe?.image ||
    recipe?.cover_url ||
    recipe?.imageUrl ||
    '';

  // Author/Avatar
  const authorName =
    recipe?.author?.display_name ||
    recipe?.author?.username ||
    recipe?.author_username ||
    'Unknown';
  const avatarUrl =
    recipe?.author?.avatar_url ||
    recipe?.author?.avatar ||
    '';

  // Meta
  const time = recipe?.cook_time || recipe?.totalTime || null;
  const servings = typeof recipe?.servings === 'number' ? recipe.servings : null;
  const rating = typeof recipe?.rating === 'number' ? recipe.rating : null;

  // Badges
  const mealType = recipe?.meal_type || null;
  const difficulty = (recipe?.difficulty || '').toLowerCase();

  function diffStyle() {
    if (!difficulty) return { bg: 'rgba(37,99,235,0.10)', color: '#1e40af', border: 'rgba(37,99,235,0.20)' };
    if (difficulty.includes('easy')) return { bg: 'rgba(16,185,129,0.12)', color: '#065f46', border: 'rgba(16,185,129,0.25)' };
    if (difficulty.includes('medium') || difficulty.includes('moderate')) return { bg: 'rgba(245,158,11,0.12)', color: '#92400e', border: 'rgba(245,158,11,0.25)' };
    if (difficulty.includes('hard') || difficulty.includes('advanced')) return { bg: 'rgba(239,68,68,0.12)', color: '#7f1d1d', border: 'rgba(239,68,68,0.25)' };
    return { bg: 'rgba(37,99,235,0.10)', color: '#1e40af', border: 'rgba(37,99,235,0.20)' };
  }

  // Hover handlers
  function onCardOver(e) {
    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
  }
  function onCardOut(e) {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
  }
  function onImgOver(e) {
    e.currentTarget.style.transform = 'scale(1.08)';
  }
  function onImgOut(e) {
    e.currentTarget.style.transform = 'scale(1.0)';
  }

  const toDetail = () => navigate(`/recipes/${recipe?.id}`);

  return (
    <article
      className="group fade-in"
      style={{
        background: '#ffffff',
        border: '1px solid #f1f1f1',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        transform: 'translateZ(0)',
        cursor: 'pointer',
      }}
      onMouseOver={onCardOver}
      onMouseOut={onCardOut}
      onClick={toDetail}
    >
      {/* Image with skeleton */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {img ? (
          <img
            src={img}
            alt={recipe?.title ? `${recipe.title} cover` : 'Recipe image'}
            className="transition-transform duration-500"
            style={{
              width: '100%',
              height: 200, // maintain consistent image height across cards
              objectFit: 'cover',
              display: 'block',
              transform: 'scale(1.0)',
            }}
            onMouseOver={onImgOver}
            onMouseOut={onImgOut}
            loading="lazy"
          />
        ) : (
          <div
            aria-label="Image loading placeholder"
            className="skeleton"
            style={{ width: '100%', height: 200 }}
          />
        )}

        {(mealType || difficulty) && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              background: diffStyle().bg,
              color: diffStyle().color,
              border: `1px solid ${diffStyle().border}`,
              backdropFilter: 'saturate(140%) blur(2px)',
            }}
          >
            {difficulty ? (difficulty[0].toUpperCase() + difficulty.slice(1)) : mealType}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        {/* Title and description */}
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, lineHeight: 1.3 }} className="mb-2">
          {recipe?.title || 'Untitled recipe'}
        </h2>
        {recipe?.description && (
          <p style={{ margin: '6px 0 12px', color: '#4b5563', fontSize: 14 }}>
            {recipe.description}
          </p>
        )}

        {/* Author and stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {avatarUrl ? (
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
                loading="lazy"
              />
            ) : (
              <div
                className="skeleton"
                style={{ width: 28, height: 28, borderRadius: 9999, border: '1px solid rgba(17,24,39,0.08)' }}
              />
            )}
            <div style={{ display: 'grid', lineHeight: 1.1 }}>
              <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {authorName}
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ChefHat size={14} /> Creator
                </span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#475569', fontSize: 13 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Clock3 size={16} /> {time ? `${time}m` : '—'}
            </span>
            {servings !== null && (
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
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #f1f1f1' }}>
          <Link
            to={`/recipes/${recipe?.id}`}
            className="transition-colors"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              display: 'inline-block',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FF6B35, #FF3D00)',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: 10,
              fontWeight: 700,
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.95')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            aria-label={`View recipe ${recipe?.title || ''}`}
          >
            View Recipe
          </Link>
        </div>
      </div>
    </article>
  );
}
