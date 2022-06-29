import { useEffect, useState } from "react";

import en from "../i18n/en.json";
import ru from "../i18n/ru.json";

type Dictionary = { [prop: string]: string | unknown };

let currentLanguage = "en";
const dictionary: Dictionary = { en, ru };

export const useTranslation = () => {
  const [language, setLanguage] = useState(currentLanguage);
  const languages = Object.keys(dictionary);

  useEffect(() => {
    currentLanguage = language || "en";
  }, [language]);

  const t = (key: string, props?: Record<string, unknown>): string => {
    let localizedString =
      key.split(".").reduce((o, i: string) => (o as Dictionary)?.[i], dictionary?.[language]) ??
      key.split(".").reduce((o, i: string) => (o as Dictionary)?.[i], dictionary?.["en"]) ??
      key;

    // replace variables
    const replacementProps = new Map(Object.entries(props || {}));
    replacementProps.forEach((value, index) => {
      localizedString = (localizedString as string).replace(`{${index}}`, value as string);
    });

    return localizedString as string;
  };

  return { t, setLanguage, language, languages };
};
