"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { type Language } from "./translations";

type LanguageContextType = {
  lang: Language;
  toggleLanguage: () => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("flowmatica-lang") as Language | null;
    if (saved && (saved === "pt" || saved === "en")) {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "lang",
      lang === "pt" ? "pt-PT" : "en"
    );
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === "pt" ? "en" : "pt";
      localStorage.setItem("flowmatica-lang", next);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
