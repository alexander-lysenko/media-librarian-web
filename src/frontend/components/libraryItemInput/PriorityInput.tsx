import { MenuItem, TextField } from "@mui/material";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { PriorityInputProps } from "../../core/types";
import type { UseControllerReturn } from "react-hook-form";

/**
 * Library Item Form - Priority Dropdown Input
 * Has 11 levels valued as range [-5, 5]. Default value is 0
 */
export const PriorityInput = (props: PriorityInputProps) => {
  const { label, errorMessage, helperText } = props;
  const { name, control } = props;
  const { t } = useTranslation();

  const menuItems = useMemo(() => {
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

    return Object.entries(options)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([key, option]) => <MenuItem key={key} value={Number(key)} children={option} />);
  }, [t]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }: UseControllerReturn) => (
        <TextField
          {...field}
          label={label}
          select
          fullWidth
          margin="dense"
          size="small"
          defaultValue={0}
          error={!!errorMessage}
          helperText={errorMessage || helperText}
          children={menuItems}
        />
      )}
    />
  );
};
