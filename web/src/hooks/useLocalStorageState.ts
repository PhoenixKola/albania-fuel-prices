import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";

type Options<T> = {
  deserialize?: (raw: string) => T;
  serialize?: (value: T) => string;
};

export function useLocalStorageState<T>(key: string, initialValue: T, options: Options<T> = {}) {
  const [state, setState] = useState<T>(() => {
    const raw = readStorage(key);
    if (raw == null) return initialValue;
    try {
      return options.deserialize ? options.deserialize(raw) : (raw as unknown as T);
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (next: T) => {
      setState(next);
      const raw = options.serialize ? options.serialize(next) : String(next);
      writeStorage(key, raw);
    },
    [key, options]
  );

  return [state, set] as const;
}