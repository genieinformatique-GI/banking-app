import fr from "./locales/fr";
import en from "./locales/en";
import es from "./locales/es";
import de from "./locales/de";
import it from "./locales/it";
import pt from "./locales/pt";
import ar from "./locales/ar";
import zh from "./locales/zh";
import ru from "./locales/ru";
import tr from "./locales/tr";
import type { TranslationType } from "./locales/fr";

export type LangCode = "fr" | "en" | "es" | "de" | "it" | "pt" | "ar" | "zh" | "ru" | "tr";

export const locales: Record<LangCode, TranslationType> = { fr, en, es, de, it, pt, ar, zh, ru, tr };

export const LANG_STORAGE_KEY = "bob_language";

export function getStoredLang(): LangCode {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored && stored in locales) return stored as LangCode;
  const browser = navigator.language.split("-")[0] as LangCode;
  if (browser in locales) return browser;
  return "fr";
}

export function setStoredLang(lang: LangCode): void {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

export type { TranslationType };
