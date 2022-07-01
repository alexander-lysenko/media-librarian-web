import create from "zustand";
import { persist } from "zustand/middleware";

import en from "../i18n/en.json";
import ru from "../i18n/ru.json";

export type Language = "en" | "ru";
export type Dictionary = { [prop: string]: string | unknown };
export type LanguageDefinitions = { [lang in Language]: string };

const dictionary: Dictionary = { en, ru };
const languages: LanguageDefinitions = { en: "English", ru: "Русский" };

export interface LanguageState {
  dictionary: Dictionary;
  languages: LanguageDefinitions;
  language: Language;
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
}

export const useTranslationStore = create<LanguageState>(
  persist(
    (set, get) => ({
      dictionary: dictionary,
      languages: languages,
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
