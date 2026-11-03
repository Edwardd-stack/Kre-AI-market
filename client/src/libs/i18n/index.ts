import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Lang } from "../enums/ai.enum";
import ko from "./locales/ko";
import en from "./locales/en";
import ru from "./locales/ru";
import uz from "./locales/uz";

const STORAGE_KEY = "kre-lang";

/** Oxirgi tanlangan til (localStorage) — bo'lmasa koreyscha */
const savedLang = (): Lang => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return Object.values(Lang).includes(value as Lang) ? (value as Lang) : Lang.KO;
  } catch {
    return Lang.KO;
  }
};

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz },
  },
  lng: savedLang(),
  fallbackLng: Lang.KO,
  interpolation: { escapeValue: false }, // React o'zi XSS'dan himoya qiladi
});

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* private rejimda localStorage ishlamasligi mumkin */
  }
});
document.documentElement.lang = i18n.language;

export default i18n;
