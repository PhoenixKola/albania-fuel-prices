import { createContext } from "react";
import type { Lang } from "../../models/i18n";
export const AdContext = createContext<{ lang: Lang; enabled: boolean; pathname: string }>({ lang: "en", enabled: false, pathname: "/" });
