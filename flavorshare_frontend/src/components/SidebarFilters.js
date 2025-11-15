import React from 'react';
import { Select } from './ui/Select';
import { tagsApi } from '../lib/api';

/**
 * PUBLIC_INTERFACE
 * SidebarFilters
 */
export function SidebarFilters({ tags: tagsProp = [], selectedTag = '', onTagChange }) {
  /** Tag filter sidebar that loads tags on mount and exposes selection. */
  const [tags, setTags] = React.useState(tagsProp);
  const [value, setValue] = React.useState(selectedTag || '');

  // Load tags on mount
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await tagsApi.listAll();
        if (mounted) setTags(all);
      } catch {
        if (mounted) setTags([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Keep local when parent changes
  React.useEffect(() => {
    setValue(selectedTag || '');
  }, [selectedTag]);

  function handleChange(nextVal) {
    setValue(nextVal);
    onTagChange?.(nextVal);
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
          <option key={t.id} value={t.id}>{t.name}</option>
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
    </aside>
  );
}
