import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { recipesApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * RecipeDetail
 */
export default function RecipeDetail() {
  /** Recipe detail page */
  const { id } = useParams();
  const [recipe, setRecipe] = React.useState(null);
  const [err, setErr] = React.useState('');
  const navigate = useNavigate();
  const { user } = useAuth() || {};

  React.useEffect(() => {
    recipesApi.getById(id).then(setRecipe).catch((e)=>setErr(e.message || 'Failed to load'));
  }, [id]);

  async function onDelete() {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await recipesApi.remove(id);
      navigate('/');
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message || 'Delete failed');
    }
  }

  if (err) return <div className="container" style={{ paddingTop: 24 }}><div role="alert">{err}</div></div>;
  if (!recipe) return <div className="container" style={{ paddingTop: 24 }}>Loading...</div>;

  const isOwner = user?.id && recipe?.author_id && user.id === recipe.author_id;
  const authorLabel = recipe?.author?.display_name || recipe?.author?.username || 'Unknown';

  return (
    <div className="container" style={{ paddingTop: 24, maxWidth: 900 }}>
      <article className="card" style={{ overflow: 'hidden' }}>
        {recipe.cover_url && <img src={recipe.cover_url} alt={`${recipe.title} cover`} style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }} />}
        <div style={{ padding: 16 }}>
          <h1 style={{ marginTop: 0 }}>{recipe.title}</h1>
          <div style={{ color: 'var(--color-muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span>Author: {authorLabel}</span>
            <span>Servings: {recipe.servings || '-'}</span>
            <span>Cook time: {recipe.cook_time || '-'}m</span>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            {isOwner && (
              <>
                <Button as={Link} to={`/recipes/${recipe.id}/edit`} variant="ghost">Edit</Button>
                <Button variant="ghost" onClick={onDelete}>Delete</Button>
              </>
            )}
          </div>
        </div>
      </article>

      <article className="card" style={{ marginTop: 16, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Ingredients</h2>
        {recipe.ingredients ? (
          <ul style={{ paddingLeft: 18, lineHeight: 1.7 }}>
            {recipe.ingredients.split('\n').map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        ) : (
          <div style={{ color: 'var(--color-muted)' }}>No ingredients listed.</div>
        )}
      </article>

      <article className="card" style={{ marginTop: 16, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Steps</h2>
        {recipe.instructions ? (
          <ol style={{ paddingLeft: 18, lineHeight: 1.7 }}>
            {recipe.instructions.split('\n').map((line, idx) => (
              <li key={idx}>{line.replace(/^\s*\d+\)\s*/, '')}</li>
            ))}
          </ol>
        ) : (
          <div style={{ color: 'var(--color-muted)' }}>No steps provided.</div>
        )}
      </article>
    </div>
  );
}
