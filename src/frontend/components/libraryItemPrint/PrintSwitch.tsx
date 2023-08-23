import { Switch } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import type { ReactElement } from "react";

export const PrintSwitch = memo(({ value, asText }: { value: boolean; asText?: boolean }) => {
  const { t } = useTranslation();

  const textValue = (value ? t("common.yes") : t("common.no")) as unknown as ReactElement;

  return asText ? textValue : <Switch disabled defaultChecked={value} />;
});
