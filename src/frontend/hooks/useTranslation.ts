import { useMemo } from "react";

import { Dictionary, useLanguageStore, useTranslationStore } from "../store/useTranslationStore";

export type LocalizedStringFn = (key: string, props?: Record<string, unknown>) => string;

export const useTranslation = () => {
  const { dictionary, getLanguages } = useTranslationStore();
  const { language, getLanguage, setLanguage } = useLanguageStore();

  const t = useMemo(
    (): LocalizedStringFn =>
      (key: string, props?: Record<string, unknown>): string => {
        let localizedString =
          key.split(".").reduce((o, i) => (o as Dictionary)?.[i], dictionary?.[language]) ??
          key.split(".").reduce((o, i) => (o as Dictionary)?.[i], dictionary?.["en"]) ??
          key;

        // replace variables
        const replacementProps = new Map(Object.entries(props || {}));
        replacementProps.forEach((value, index) => {
          localizedString = (localizedString as string).replace(`{${index}}`, value as string);
        });

        return localizedString as string;
      },
    [dictionary, language],
  );

  return { t, getLanguage, setLanguage, languages: getLanguages() };
};
