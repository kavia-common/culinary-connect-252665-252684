import React from 'react';
import { SidebarFilters } from '../components/SidebarFilters';
import { RecipeGrid } from '../components/RecipeGrid';
import { useRecipes } from '../hooks/useRecipes';
import { tagsApi, recipesApi } from '../lib/api';

/**
 * PUBLIC_INTERFACE
 * Home
 * Public feed of recipes with filters
 */
export default function Home() {
  /** Home page showing recipe grid and filters */
  const [tags, setTags] = React.useState([]);
  const [selectedTag, setSelectedTag] = React.useState('');
  const [recipes, setRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Load tags for dropdown
  React.useEffect(() => {
    tagsApi.listAll().then(setTags).catch(() => setTags([]));
  }, []);

  // Load recipes whenever tag filter changes
  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await recipesApi.list({ page: 1, pageSize: 12, search: '', tagId: selectedTag || '' });
        if (active) setRecipes(res.data || []);
      } catch {
        if (active) setRecipes([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [selectedTag]);

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <div className="grid" role="region" aria-label="Home content">
        <div className="sidebar">
          <SidebarFilters tags={tags} selectedTag={selectedTag} onTagChange={setSelectedTag} />
        </div>
        <main className="main">
          {loading ? <div>Loading...</div> : <RecipeGrid recipes={recipes} />}
        </main>
      </div>
    </div>
  );
}
