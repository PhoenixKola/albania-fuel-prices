import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const tRef = useRef<number | null>(null);

  const show = useCallback((msg: string) => {
    setToast(msg);
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => setToast(null), 1600);
  }, []);

  return { toast, show };
}