import React, { createContext, useContext, useState, useEffect } from "react";
import { locales, getStoredLang, setStoredLang, type LangCode, type TranslationType } from "@/i18n";

interface LanguageContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: TranslationType;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(getStoredLang);

  const setLang = (newLang: LangCode) => {
    setLangState(newLang);
    setStoredLang(newLang);
  };

  const t = locales[lang];
  const dir = t.lang.dir as "ltr" | "rtl";

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
