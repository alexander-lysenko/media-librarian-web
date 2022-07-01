import create from "zustand";

export type Dictionary = { [prop: string]: string | unknown };
type Language = keyof Dictionary;

export interface LanguageState {
  language: Language;
  languages: Language[];
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
  setLanguages: (languages: Language[]) => void;
  getLanguages: () => Language[];
}

export const useTranslationStore = create<LanguageState>((set, get) => ({
  languages: [],
  language: "en",
  setLanguage: (language: Language) => set(() => ({ language })),
  getLanguage: () => get().language,
  setLanguages: (languages: Language[]) => set(() => ({ languages })),
  getLanguages: () => get().languages,
}));
