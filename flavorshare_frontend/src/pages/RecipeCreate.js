import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { recipesApi } from '../lib/api';
import { uploadRecipeImage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * RecipeCreate
 */
export default function RecipeCreate() {
  /** Create recipe page with image upload */
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [servings, setServings] = React.useState('');
  const [cookTime, setCookTime] = React.useState('');
  const [coverFile, setCoverFile] = React.useState(null);
  const [err, setErr] = React.useState('');

  // Dynamic lists for ingredients and steps
  const [ingredients, setIngredients] = React.useState([
    { name: '', quantity: '' }
  ]);
  const [steps, setSteps] = React.useState(['']);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      if (!user) { setErr('You must be logged in'); return; }
      if (!title) { setErr('Title is required'); return; }

      let cover_url = '';
      if (coverFile) {
        const { publicUrl } = await uploadRecipeImage(coverFile, 'new');
        cover_url = publicUrl || '';
      }
      // Validate at least one ingredient and one step
      const hasIngredient = ingredients.some((ing) => (ing.name || '').trim().length > 0);
      const hasStep = steps.some((s) => (s || '').trim().length > 0);
      if (!hasIngredient) { setErr('Please add at least one ingredient'); return; }
      if (!hasStep) { setErr('Please add at least one step'); return; }

      const payload = {
        title,
        servings: servings ? Number(servings) : null,
        cook_time: cookTime ? Number(cookTime) : null,
        cover_url,
        // API create will serialize ingredients/steps appropriately
        ingredients: ingredients,
        steps: steps,
        author_id: user.id,
        created_at: new Date().toISOString()
      };
      const rec = await recipesApi.create(payload);
      navigate(`/recipes/${rec.id}`);
    } catch (error) {
      setErr(error.message || 'Failed to create recipe');
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, maxWidth: 720 }}>
      <h1>New Recipe</h1>
      {err && <div role="alert" style={{ color: 'var(--color-error)', marginBottom: 12 }}>{err}</div>}
      <form className="card" onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 12 }}>
        <Input id="title" label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <Input id="servings" label="Servings" type="number" value={servings} onChange={(e)=>setServings(e.target.value)} />
        <Input id="cookTime" label="Cook time (minutes)" type="number" value={cookTime} onChange={(e)=>setCookTime(e.target.value)} />
        <div>
          <label htmlFor="cover" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Cover image</label>
          <input id="cover" type="file" accept="image/*" onChange={(e)=>setCoverFile(e.target.files?.[0]||null)} />
        </div>

        <section className="card" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Ingredients</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'end' }}>
                <Input
                  id={`ing-name-${idx}`}
                  label="Ingredient"
                  placeholder="e.g., Flour"
                  value={ing.name}
                  onChange={(e) => {
                    const next = ingredients.slice();
                    next[idx] = { ...next[idx], name: e.target.value };
                    setIngredients(next);
                  }}
                />
                <Input
                  id={`ing-qty-${idx}`}
                  label="Quantity/Measure"
                  placeholder="e.g., 2 cups"
                  value={ing.quantity}
                  onChange={(e) => {
                    const next = ingredients.slice();
                    next[idx] = { ...next[idx], quantity: e.target.value };
                    setIngredients(next);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    const next = ingredients.slice();
                    next.splice(idx, 1);
                    setIngredients(next.length ? next : [{ name: '', quantity: '' }]);
                  }}
                  aria-label={`Remove ingredient ${idx + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIngredients([...ingredients, { name: '', quantity: '' }])}
            >
              + Add ingredient
            </button>
          </div>
        </section>

        <section className="card" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Steps</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {steps.map((s, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <div>
                  <label htmlFor={`step-${idx}`} style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                    Step {idx + 1}
                  </label>
                  <textarea
                    id={`step-${idx}`}
                    className="input"
                    rows={3}
                    placeholder="Describe this step..."
                    value={s}
                    onChange={(e) => {
                      const next = steps.slice();
                      next[idx] = e.target.value;
                      setSteps(next);
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    const next = steps.slice();
                    next.splice(idx, 1);
                    setSteps(next.length ? next : ['']);
                  }}
                  aria-label={`Remove step ${idx + 1}`}
                  style={{ alignSelf: 'end' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSteps([...steps, ''])}
            >
              + Add step
            </button>
          </div>
        </section>

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
