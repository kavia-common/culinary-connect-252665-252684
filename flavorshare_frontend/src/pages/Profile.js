import React from 'react';
import { useParams } from 'react-router-dom';
import { profileApi } from '../lib/api';
import { RecipeGrid } from '../components/RecipeGrid';
import { useRecipes } from '../hooks/useRecipes';

/**
 * PUBLIC_INTERFACE
 * Profile
 */
export default function Profile() {
  /** User profile page */
  const { id } = useParams();
  const [profile, setProfile] = React.useState(null);
  const { recipes, loading } = useRecipes({ authorId: id });

  React.useEffect(() => {
    profileApi.getProfile(id).then(setProfile).catch(() => setProfile(null));
  }, [id]);

  return (
    <div className="container no-overflow-x" style={{ paddingTop: 24, overflowX: 'hidden' }}>
      <div className="card" style={{ padding: 16 }}>
        <h1 style={{ marginTop: 0 }}>{profile?.username || 'User'}</h1>
        <div style={{ color: 'var(--color-muted)' }}>{profile?.bio || 'No bio yet.'}</div>
      </div>
      <div style={{ marginTop: 16 }}>
        {loading ? <div>Loading...</div> : <RecipeGrid recipes={recipes} />}
      </div>
    </div>
  );
}
