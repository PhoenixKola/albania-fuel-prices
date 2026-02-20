import { useCallback, useMemo } from "react";
import { STORAGE_WATCHLIST_KEY } from "../config/constants";
import { useLocalStorageState } from "./useLocalStorageState";

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useLocalStorageState<string[]>(STORAGE_WATCHLIST_KEY, [], {
    deserialize: (raw) => {
      try {
        const v = JSON.parse(raw);
        return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
      } catch {
        return [];
      }
    },
    serialize: (v) => JSON.stringify(v),
  });

  const add = useCallback(
    (country: string) => {
      setWatchlist(uniq([country, ...watchlist]).slice(0, 12));
    },
    [watchlist, setWatchlist]
  );

  const remove = useCallback(
    (country: string) => {
      setWatchlist(watchlist.filter((c) => c !== country));
    },
    [watchlist, setWatchlist]
  );

  const has = useMemo(() => new Set(watchlist), [watchlist]);

  return { watchlist, add, remove, has };
}