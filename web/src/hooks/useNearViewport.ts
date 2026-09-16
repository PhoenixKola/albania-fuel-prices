import { useEffect, useState } from "react";

export function useNearViewport(element: Element | null, rootMargin = "250px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near || !element) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setNear(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, near, rootMargin]);

  return near;
}
