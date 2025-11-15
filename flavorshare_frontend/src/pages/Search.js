import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeGrid } from '../components/RecipeGrid';

/**
 * PUBLIC_INTERFACE
 * Search
 */
export default function Search() {
  /** Search results page */
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = params.get('q') || '';

  const { recipes, loading } = useRecipes({ initialSearch: q });

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h1>Search</h1>
      <div style={{ color: 'var(--color-muted)', marginBottom: 12 }}>Results for: <strong>{q}</strong></div>
      {loading ? <div>Loading...</div> : <RecipeGrid recipes={recipes} />}
    </div>
  );
}
