import { memo } from "react";
import { useTranslation } from "react-i18next";

import type { ReactElement } from "react";

export const PrintPriority = memo(({ value }: { value: number }) => {
  const { t } = useTranslation();
  const options: Record<number, string> = {
    "-5": t("priorityOptions.-5"),
    "-4": t("priorityOptions.-4"),
    "-3": t("priorityOptions.-3"),
    "-2": t("priorityOptions.-2"),
    "-1": t("priorityOptions.-1"),
    "0": t("priorityOptions.0"),
    "1": t("priorityOptions.1"),
    "2": t("priorityOptions.2"),
    "3": t("priorityOptions.3"),
    "4": t("priorityOptions.4"),
    "5": t("priorityOptions.5"),
  };

  return options[value] as unknown as ReactElement;
});
