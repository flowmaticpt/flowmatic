"use client";

import { useContext } from "react";
import { LanguageContext } from "./language-provider";
import { translations, type TranslationKey } from "./translations";

export function useTranslation() {
  const { lang, toggleLanguage } = useContext(LanguageContext);
  const t = (key: TranslationKey) => translations[lang][key];
  return { t, lang, toggleLanguage };
}
