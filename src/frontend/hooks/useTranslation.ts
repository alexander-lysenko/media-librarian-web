import { useMemo } from "react";

import { Dictionary, useLanguageStore, useTranslationStore } from "../store/useTranslationStore";

export const useTranslation = () => {
  const { dictionary, languages } = useTranslationStore();
  const { getLanguage, setLanguage } = useLanguageStore();

  const t = useMemo(
    () =>
      (key: string, props?: Record<string, unknown>): string => {
        const lang = getLanguage();

        let localizedString =
          key.split(".").reduce((o, i) => (o as Dictionary)?.[i], dictionary?.[lang]) ??
          key.split(".").reduce((o, i) => (o as Dictionary)?.[i], dictionary?.["en"]) ??
          key;

        // replace variables
        const replacementProps = new Map(Object.entries(props || {}));
        replacementProps.forEach((value, index) => {
          localizedString = (localizedString as string).replace(`{${index}}`, value as string);
        });

        return localizedString as string;
      },
    [dictionary, getLanguage],
  );

  return { t, getLanguage, setLanguage, languages };
};
