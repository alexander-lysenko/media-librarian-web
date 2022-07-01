import { useEffect, useMemo, useState } from "react";
import shallow from "zustand/shallow";

import en from "../i18n/en.json";
import ru from "../i18n/ru.json";
import { Dictionary, useTranslationStore } from "./useTranslationStore";

const dictionary: Dictionary = { en, ru };
const languages = Object.keys(dictionary);

export const useTranslation = () => {
  const { getLanguage, setLanguage, getLanguages, setLanguages } = useTranslationStore(
    (state) => state,
  );

  useEffect(() => {
    setLanguages(languages);
  }, [setLanguages]);

  const t = (key: string, props?: Record<string, unknown>): string => {
    const lang = getLanguage();

    let localizedString =
      key.split(".").reduce((o, i: string) => (o as Dictionary)?.[i], dictionary?.[lang]) ??
      key.split(".").reduce((o, i: string) => (o as Dictionary)?.[i], dictionary?.["en"]) ??
      key;

    // replace variables
    const replacementProps = new Map(Object.entries(props || {}));
    replacementProps.forEach((value, index) => {
      localizedString = (localizedString as string).replace(`{${index}}`, value as string);
    });

    return localizedString as string;
  };

  return { t, getLanguage, setLanguage, getLanguages };
};
