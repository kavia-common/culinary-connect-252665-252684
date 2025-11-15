import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { recipesApi } from '../lib/api';
import { uploadRecipeImage } from '../lib/storage';

/**
 * PUBLIC_INTERFACE
 * RecipeEdit
 */
export default function RecipeEdit() {
  /** Edit recipe page */
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [servings, setServings] = React.useState('');
  const [cookTime, setCookTime] = React.useState('');
  const [coverFile, setCoverFile] = React.useState(null);
  const [err, setErr] = React.useState('');

  const [ingredients, setIngredients] = React.useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = React.useState(['']);

  React.useEffect(() => {
    recipesApi.getById(id).then(r => {
      setRecipe(r);
      setTitle(r?.title || '');
      setServings(r?.servings || '');
      setCookTime(r?.cook_time || '');

      // Parse ingredients from text (lines "qty name" or arbitrary)
      const ingLines = (r?.ingredients || '').split('\n').map((s) => s.trim()).filter(Boolean);
      if (ingLines.length > 0) {
        const parsed = ingLines.map((line) => {
          // naive split: quantity is first tokens that include digits or fractions, else empty
          // to keep it simple, try split first two words as qty and rest as name if qty-like
          const parts = line.split(/\s+/);
          if (parts.length >= 2) {
            const firstTwo = parts.slice(0, 2).join(' ');
            const restAfterTwo = parts.slice(2).join(' ');
            // Heuristic: if first token contains a digit or '/', treat as quantity
            const first = parts[0] || '';
            const looksLikeQty = /[0-9\/]/.test(first);
            if (looksLikeQty) {
              return { quantity: firstTwo.trim(), name: restAfterTwo || parts.slice(1).join(' ') };
            }
          }
          // Fallback: all as name
          return { quantity: '', name: line };
        });
        setIngredients(parsed);
      } else {
        setIngredients([{ name: '', quantity: '' }]);
      }

      // Parse steps: lines that may be prefixed with "1) "
      const stepLines = (r?.instructions || '').split('\n')
        .map((s) => s.replace(/^\s*\d+\)\s*/, '').trim())
        .filter(Boolean);
      setSteps(stepLines.length ? stepLines : ['']);
    }).catch((e) => setErr(e.message || 'Failed to load recipe'));
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      let cover_url = recipe?.cover_url || '';
      if (coverFile) {
        const { publicUrl } = await uploadRecipeImage(coverFile, id);
        cover_url = publicUrl || cover_url;
      }
      // Validate lists
      const hasIngredient = ingredients.some((ing) => (ing.name || '').trim().length > 0);
      const hasStep = steps.some((s) => (s || '').trim().length > 0);
      if (!hasIngredient) { setErr('Please include at least one ingredient'); return; }
      if (!hasStep) { setErr('Please include at least one step'); return; }

      const payload = {
        title,
        servings: servings ? Number(servings) : null,
        cook_time: cookTime ? Number(cookTime) : null,
        cover_url,
        ingredients,
        steps
      };
      await recipesApi.update(id, payload);
      navigate(`/recipes/${id}`);
    } catch (error) {
      setErr(error.message || 'Update failed');
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, maxWidth: 720 }}>
      <h1>Edit Recipe</h1>
      {err && <div role="alert" style={{ color: 'var(--color-error)', marginBottom: 12 }}>{err}</div>}
      <form className="card" onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 12 }}>
        <Input id="title" label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <Input id="servings" label="Servings" type="number" value={servings} onChange={(e)=>setServings(e.target.value)} />
        <Input id="cookTime" label="Cook time (minutes)" type="number" value={cookTime} onChange={(e)=>setCookTime(e.target.value)} />
        <div>
          <label htmlFor="cover" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Replace cover image</label>
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

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
