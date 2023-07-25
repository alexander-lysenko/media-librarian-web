import dayjs from "dayjs";
import { memo, ReactElement } from "react";

import { useLanguageStore } from "../../store/useTranslationStore";

type DateFieldProps = {
  format: "date" | "datetime";
  value: string;
};

export const PrintDate = memo(({ format, value }: DateFieldProps) => {
  const locale = useLanguageStore((state) => state.getLanguage());
  const outputFormat: Record<DateFieldProps["format"], string> = {
    date: "LL",
    datetime: "ll LTS",
  };

  return dayjs(value).locale(locale).format(outputFormat[format]) as unknown as ReactElement;
});
