import create from "zustand";
import { persist } from "zustand/middleware";

import en from "../i18n/en.json";
import ru from "../i18n/ru.json";

export type Language = "en" | "ru";
export type Dictionary = { [prop: string]: string | unknown };
export type LanguageDefinitions = { [lang in Language]: string };

const dictionary: Dictionary = { en, ru };
const languages: LanguageDefinitions = { en: "English", ru: "Русский" };

export interface TranslationState {
  dictionary: Dictionary;
  languages: LanguageDefinitions;
  setLanguages: (languages: LanguageDefinitions) => void;
  getLanguages: () => LanguageDefinitions;
}

export interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  dictionary: dictionary,
  languages: languages,
  setLanguages: (languages: LanguageDefinitions) => set(() => ({ languages })),
  getLanguages: () => get().languages,
}));

export const useLanguageStore = create<LanguageState>(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language: Language) => set(() => ({ language })),
      getLanguage: () => get().language,
    }),
    {
      name: "locale-storage", // unique name
      getStorage: () => sessionStorage,
    },
  ),
);
