// src/LanguageProvider.tsx

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  createTranslator,
  getInitialLanguage,
  persistLanguage,
} from "./i18n";

import type { LanguageCode } from "./i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: ReturnType<typeof createTranslator>;
};

const LanguageContext = createContext<
  LanguageContextValue | undefined
>(undefined);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [language, setLanguageState] =
    useState<LanguageCode>(getInitialLanguage());

  const t = useMemo(
    () => createTranslator(language),
    [language]
  );

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    persistLanguage(lang);
  };

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error(
      "useLanguage must be used within LanguageProvider"
    );
  }

  return ctx;
}