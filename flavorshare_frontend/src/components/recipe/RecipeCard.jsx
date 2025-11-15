import React from 'react';
import { Link } from 'react-router-dom';
// Requires: npm install lucide-react
import { Clock3, Users, Eye, ChefHat, Utensils } from 'lucide-react';

/**
 * PUBLIC_INTERFACE
 * RecipeCard (Redesigned)
 * A modern elevated card with hover effects, image zoom, meal_type/difficulty badge, author block, and CTA.
 */
export default function RecipeCard({ recipe }) {
  /** Render a beautiful responsive recipe card with safe fallbacks. */
  const img =
    recipe?.cover_url ||
    recipe?.imageUrl ||
    '/api/placeholder/400/250';

  // Author derivation
  const authorName =
    recipe?.author?.display_name ||
    recipe?.author?.username ||
    recipe?.author_username ||
    'Unknown';

  const avatarUrl =
    recipe?.author?.avatar_url ||
    recipe?.author?.avatar ||
    '/api/placeholder/32/32';

  // Meal type badge mapping
  const mealType = recipe?.meal_type || null;
  const difficulty = recipe?.difficulty || null;

  function mealTypeBadgeStyle(type) {
    const map = {
      Breakfast: 'background: rgba(59,130,246,0.12); color:#1d4ed8; border:1px solid rgba(59,130,246,0.25)',
      Lunch: 'background: rgba(16,185,129,0.12); color:#047857; border:1px solid rgba(16,185,129,0.25)',
      Dinner: 'background: rgba(234,179,8,0.16); color:#92400e; border:1px solid rgba(234,179,8,0.28)',
      Snacks: 'background: rgba(249,115,22,0.12); color:#c2410c; border:1px solid rgba(249,115,22,0.25)',
    };
    return map[type] || map.Dinner;
  }

  const time = recipe?.cook_time || recipe?.totalTime || null;
  const servings = recipe?.servings || null;
  const views = recipe?.views || null;

  return (
    <article
      className="group fade-in"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(17,24,39,0.06)',
        borderRadius: 24, // rounded-3xl
        overflow: 'hidden',
        boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
        transform: 'translateZ(0)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.12)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.06)';
      }}
    >
      {/* Image header with badge */}
      <div
        style={{
          position: 'relative',
          height: 200,
          background: '#e5e7eb',
        }}
      >
        <img
          src={img}
          alt={recipe?.title ? `${recipe.title} cover` : 'Recipe image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: 'scale(1)',
            transition: 'transform 420ms ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Badge top-right: prefer meal_type; else difficulty */}
        {(mealType || difficulty) && (
          <div
            aria-label="Recipe category"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '6px 10px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              ...(mealType
                ? Object.fromEntries(
                    mealTypeBadgeStyle(mealType)
                      .split(';')
                      .filter(Boolean)
                      .map((rule) => {
                        const [k, v] = rule.split(':').map((s) => s.trim());
                        const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                        return [camel, v];
                      })
                  )
                : {
                    background: 'rgba(99,102,241,0.12)',
                    color: '#3730a3',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }),
            }}
          >
            {mealType || difficulty}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 16, display: 'grid', gap: 10 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.25,
          }}
        >
          {recipe?.title || 'Untitled recipe'}
        </h3>

        {/* Author block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={avatarUrl}
            alt={`${authorName} avatar`}
            width={28}
            height={28}
            style={{ borderRadius: 9999, border: '1px solid rgba(17,24,39,0.08)', objectFit: 'cover' }}
          />
          <div style={{ display: 'grid', gap: 2 }}>
            <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{authorName}</span>
            <span style={{ fontSize: 12, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ChefHat size={14} /> Creator
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
            color: '#475569',
            fontSize: 13,
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Clock3 size={16} /> {time ? `${time}m` : '—'}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Users size={16} /> {servings || '—'}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Eye size={16} /> {typeof views === 'number' ? views : '—'}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
          <Link
            to={`/recipes/${recipe?.id}`}
            className="transition-all duration-300 ease-out"
            style={{
              background:
                'linear-gradient(135deg, rgba(245,158,11,1), rgba(251,191,36,1))',
              color: '#111827',
              fontWeight: 800,
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(0.98)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = 'none')}
            aria-label={`View recipe ${recipe?.title || ''}`}
          >
            <Utensils size={16} />
            View Recipe
          </Link>
        </div>
      </div>
    </article>
  );
}
