export function normalizeCanonicalPath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}
