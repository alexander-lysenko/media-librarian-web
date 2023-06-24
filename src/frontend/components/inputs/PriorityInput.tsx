import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

import { PriorityInputProps } from "../../core/types";

/**
 * Library Item Form - Priority Dropdown Input
 * Has 11 levels valued as range [-5, 5]. Default value is 0
 */
export const PriorityInput = forwardRef((props: PriorityInputProps, ref) => {
  const { label, name, errorMessage, helperText, onBlur, onChange } = props;
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

  return (
    <FormControl fullWidth margin="dense" size="small" error={!!errorMessage}>
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        inputRef={ref}
        labelId={name}
        label={label}
        name={name}
        defaultValue={"0"}
        onChange={onChange}
        onBlur={onBlur}
      >
        {Object.entries(options)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([key, option]) => (
            <MenuItem key={key} value={key} children={option} />
          ))}
      </Select>
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
});
