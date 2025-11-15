import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeGrid } from '../components/RecipeGrid';
import { useDebounce } from '../hooks/useDebounce';

/**
 * PUBLIC_INTERFACE
 * Search
 */
export default function Search() {
  /** Search results page with debounced query from URL */
  const { search } = useLocation();
  const [query, setQuery] = React.useState(() => {
    const p = new URLSearchParams(search);
    return p.get('q') || '';
  });
  const debounced = useDebounce(query, 400);

  // Tag-based filtering is disabled in UI; only text search is used
  const { recipes, loading, setSearch } = useRecipes({ initialSearch: debounced });

  // Keep local state in sync when URL changes externally (e.g., via header)
  React.useEffect(() => {
    const p = new URLSearchParams(search);
    const nextQ = p.get('q') || '';
    setQuery(nextQ);
  }, [search]);

  // When debounced local query changes, propagate to hook for API call
  React.useEffect(() => {
    setSearch(debounced);
  }, [debounced, setSearch]);

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h1>Search</h1>
      <div style={{ color: 'var(--color-muted)', marginBottom: 12 }}>
        Results for: <strong>{debounced}</strong>
      </div>
      {loading ? <div>Loading...</div> : <RecipeGrid recipes={recipes} />}
    </div>
  );
}
