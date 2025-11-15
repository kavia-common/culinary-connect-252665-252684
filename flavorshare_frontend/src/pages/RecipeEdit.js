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

  React.useEffect(() => {
    recipesApi.getById(id).then(r => {
      setRecipe(r);
      setTitle(r?.title || '');
      setServings(r?.servings || '');
      setCookTime(r?.cook_time || '');
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
      const payload = {
        title,
        servings: servings ? Number(servings) : null,
        cook_time: cookTime ? Number(cookTime) : null,
        cover_url
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
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
