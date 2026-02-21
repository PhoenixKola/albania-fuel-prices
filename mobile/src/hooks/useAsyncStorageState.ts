import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Options<T> = {
  serialize?: (v: T) => string;
  deserialize?: (raw: string) => T;
};

export function useAsyncStorageState<T>(key: string, initial: T, options?: Options<T>) {
  const serialize = options?.serialize ?? ((v: any) => String(v));
  const deserialize = options?.deserialize ?? ((raw: any) => raw as T);

  const [value, setValueState] = useState<T>(initial);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (cancelled) return;
        if (raw != null) setValueState(deserialize(raw));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const v = typeof next === "function" ? (next as any)(prev) : next;
        AsyncStorage.setItem(key, serialize(v)).catch(() => {});
        return v;
      });
    },
    [key]
  );

  return { value, setValue };
}