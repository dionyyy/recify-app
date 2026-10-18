import { useState, useEffect } from "react";
import { SEARCH_DEBOUNCE_MS } from "@/constants";

export function useDebouncedSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [query]);

  return { query, setQuery, debouncedQuery };
}
