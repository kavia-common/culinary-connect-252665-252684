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
      const payload = {
        title,
        servings: servings ? Number(servings) : null,
        cook_time: cookTime ? Number(cookTime) : null,
        cover_url,
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
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
