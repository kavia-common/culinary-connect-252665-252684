import { useCallback, useEffect, useMemo, useState } from 'react';
import { recipesApi } from '../lib/api';

/**
 * PUBLIC_INTERFACE
 * useRecipes
 * Fetches and paginates recipes with search term.
 */
export function useRecipes({ initialSearch = '', pageSize = 12, authorId = null } = {}) {
  /** Provides recipes, pagination, searching. */
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [pageSizeState] = useState(pageSize);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recipesApi.list({ page, pageSize: pageSizeState, search, authorId });
      setData(res.data || []);
      setCount(res.count || 0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSizeState, search, authorId]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((count || 0) / pageSizeState)), [count, pageSizeState]);

  return {
    recipes: data,
    count,
    page, setPage,
    totalPages,
    loading,
    search, setSearch,
    reload: load
  };
}
