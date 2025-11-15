import React from 'react';
import { Select } from './ui/Select';
import { tagsApi } from '../lib/api';

/**
 * PUBLIC_INTERFACE
 * SidebarFilters
 */
export function SidebarFilters({ tags: tagsProp = [], selectedTag = '', onTagChange }) {
  /** Tag filter sidebar that loads tags on mount and exposes selection. Provides fallback tags when Supabase has none. */
  // Default fallback tags (display-only when DB empty)
  const FALLBACK_TAGS = React.useMemo(
    () => [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Vegan',
      'Dessert',
      'Quick Meals',
      'Healthy',
      'Kids Special',
    ],
    []
  );

  const [tags, setTags] = React.useState(tagsProp);
  const [value, setValue] = React.useState(selectedTag || '');
  const [usingFallback, setUsingFallback] = React.useState(false);
  const [seedMsg, setSeedMsg] = React.useState('');

  // Optional one-time seed toggle for admins/developers.
  // Toggle to true to enable the "Seed default tags" button when authenticated.
  // Note: Do NOT enable in production code by default.
  const ENABLE_ADMIN_SEED = false;

  // Load tags on mount
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await tagsApi.listAll();
        if (!mounted) return;

        if (Array.isArray(all) && all.length > 0) {
          setTags(all);
          setUsingFallback(false);
        } else {
          // Use fallback when Supabase is empty
          const fallback = FALLBACK_TAGS.map((name, idx) => ({
            id: `fallback-${idx}`,
            name,
          }));
          setTags(fallback);
          setUsingFallback(true);
        }
      } catch {
        if (!mounted) return;
        // On error, still present fallback so users can filter client-side immediately
        const fallback = FALLBACK_TAGS.map((name, idx) => ({
          id: `fallback-${idx}`,
          name,
        }));
        setTags(fallback);
        setUsingFallback(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [FALLBACK_TAGS]);

  // Keep local when parent changes
  React.useEffect(() => {
    setValue(selectedTag || '');
  }, [selectedTag]);

  function handleChange(nextVal) {
    setValue(nextVal);
    onTagChange?.(nextVal);
  }

  // Optional seed handler: inserts the default tags once into Supabase if authenticated and policy permits.
  // This runs only when ENABLE_ADMIN_SEED is true and the user clicks the button.
  async function handleSeedDefaultTags() {
    try {
      setSeedMsg('Seeding tags...');
      // Use dynamic import to avoid circular refs; but tagsApi is already imported.
      // We implement seeding via a small helper inside this component to avoid over-scattering code.
      // Attempt to insert missing tags by name.
      const toInsert = FALLBACK_TAGS.map((name) => ({ name }));
      // Use Supabase client through tagsApi by augmenting tagsApi with a seed call-like behavior is not present,
      // so we'll implement a lightweight inline approach by accessing tags table through tagsApi-like path.
      // Since tagsApi has only listAll, we will use a dynamic import of supabase client.
      const { getSupabase } = await import('../lib/supabaseClient');
      const supabase = getSupabase();

      // Fetch existing to avoid duplicate inserts
      const existing = await tagsApi.listAll().catch(() => []);
      const existingLower = new Set((existing || []).map((t) => (t.name || '').toLowerCase()));
      const filtered = toInsert.filter((t) => !existingLower.has((t.name || '').toLowerCase()));

      if (filtered.length === 0) {
        setSeedMsg('Default tags already exist.');
        return;
      }

      const { error } = await supabase.from('tags').insert(filtered);
      if (error) throw error;

      // Reload tags from DB
      const all = await tagsApi.listAll().catch(() => []);
      setTags(all.length ? all : filtered);
      setUsingFallback(false);
      setSeedMsg('Seeded successfully.');
    } catch (e) {
      setSeedMsg(e?.message || 'Failed to seed tags. Ensure you are logged in and have permission.');
    } finally {
      setTimeout(() => setSeedMsg(''), 3000);
    }
  }

  return (
    <aside className="card" style={{ padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>
      <Select
        id="tag"
        label="Tag"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Filter by tag"
      >
        <option value="">All</option>
        {tags.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </Select>
      {value && (
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => handleChange('')}
            aria-label="Clear tag filter"
            title="Clear tag filter"
          >
            Clear filter
          </button>
        </div>
      )}

      {usingFallback && (
        <div role="note" style={{ marginTop: 10, fontSize: 12, color: 'var(--color-muted)' }}>
          Showing default tags (no tags found in database yet).
        </div>
      )}

      {ENABLE_ADMIN_SEED && usingFallback && (
        <div style={{ marginTop: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={handleSeedDefaultTags}>
            Seed default tags to Supabase
          </button>
          {seedMsg && (
            <div role="status" style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>
              {seedMsg}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
