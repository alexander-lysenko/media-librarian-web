import i18next, { i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import en from "../i18n/en.json";
import ru from "../i18n/ru.json";

export type Language = "en" | "ru";
export type LanguageDefinitions = { [lang in Language]: string };

const languageDefinitions: LanguageDefinitions = {
  en: "English",
  ru: "Русский",
};

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

export interface TranslationState {
  i18nInstance: i18n;
  languages: LanguageDefinitions;
}

export interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
}

// noinspection SpellCheckingInspection
export const useTranslationStore = create<TranslationState>(() => ({
  i18nInstance: i18next
    .createInstance({
      // configure languages and resources
      resources: resources,
      supportedLngs: Object.keys(languageDefinitions),
      fallbackLng: "en",
      // lng: "en", // if you're using a language detector, do not define the lng option

      // react i18next special options (optional)
      react: {
        bindI18n: "languageChanged",
        bindI18nStore: "",
        transEmptyNodeValue: "",
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ["br", "strong", "em"],
        useSuspense: true,
      },

      // configure anything else
      returnNull: false,
      debug: true,
    })
    .use(initReactI18next),
  languages: languageDefinitions,
}));

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language: Language) => {
        useTranslationStore
          .getState()
          .i18nInstance.changeLanguage(language)
          .then(() => set({ language }));
      },
      getLanguage: () => get().language,
    }),
    {
      name: "localePreferences", // unique name
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
