import React from 'react';
import { Select } from './ui/Select';

/**
 * PUBLIC_INTERFACE
 * SidebarFilters
 */
export function SidebarFilters({ tags = [], selectedTag = '', onTagChange }) {
  /** Simple tag filter sidebar. */
  return (
    <aside className="card" style={{ padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>
      <Select id="tag" label="Tag" value={selectedTag} onChange={(e) => onTagChange?.(e.target.value)}>
        <option value="">All</option>
        {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </Select>
    </aside>
  );
}
