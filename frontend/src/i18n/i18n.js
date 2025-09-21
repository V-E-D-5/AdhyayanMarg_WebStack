import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "./locales/en.json";
import hiTranslations from "./locales/hi.json";
import knTranslations from "./locales/kn.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  kn: {
    translation: knTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: import.meta.env.VITE_DEBUG === "true",

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
