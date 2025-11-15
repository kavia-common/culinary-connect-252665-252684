import React from 'react';
import { SidebarFilters } from '../components/SidebarFilters';
import { RecipeGrid } from '../components/RecipeGrid';
import { useRecipes } from '../hooks/useRecipes';
import { tagsApi } from '../lib/api';

/**
 * PUBLIC_INTERFACE
 * Home
 * Public feed of recipes with filters
 */
export default function Home() {
  /** Home page showing recipe grid and filters */
  const { recipes, loading } = useRecipes({});
  const [tags, setTags] = React.useState([]);
  const [selectedTag, setSelectedTag] = React.useState('');

  React.useEffect(() => {
    tagsApi.listAll().then(setTags).catch(() => setTags([]));
  }, []);

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
