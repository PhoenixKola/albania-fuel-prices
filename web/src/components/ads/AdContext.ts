import { createContext } from "react";
import type { Lang } from "../../models/i18n";
export const AdContext = createContext<{
  lang: Lang;
  enabled: boolean;
  pathname: string;
  advertising: boolean | null;
  setAdvertising: (value: boolean) => void;
  openPrivacy: () => void;
}>({
  lang: "en",
  enabled: false,
  pathname: "/",
  advertising: null,
  setAdvertising: () => undefined,
  openPrivacy: () => undefined,
});
