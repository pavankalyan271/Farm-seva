// src/i18n/index.ts
import { en } from "./en";
import { te } from "./te";
import { hi } from "./hi";

export type LanguageCode = "en" | "te" | "hi";

const dictionaries: Record<LanguageCode, typeof en> = {
  en,
  te,
  hi,
};

export const DEFAULT_LANGUAGE: LanguageCode = "en";
const STORAGE_KEY = "farmseva_language";

export function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "te" || stored === "hi") {
      return stored;
    }
  } catch {
    // ignore
  }
  return DEFAULT_LANGUAGE;
}

export function persistLanguage(lang: LanguageCode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export function createTranslator(lang: LanguageCode) {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANGUAGE];
  return function t<K extends keyof typeof en>(key: K): (typeof en)[K] {
    return dict[key];
  };
}
