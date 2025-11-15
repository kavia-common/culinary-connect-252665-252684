import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useDebounce
 * Debounces a changing value by a delay
 */
export function useDebounce(value, delay = 300) {
  /** Returns debounced value after the specified delay. */
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
