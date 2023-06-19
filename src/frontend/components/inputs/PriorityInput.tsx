import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

import { CustomInputProps } from "../../core/types";

export const PriorityInput = forwardRef((props: CustomInputProps, ref) => {
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

  const { label, name, value, errorMessage, helperText, onBlur, onChange } = props;
  return (
    <FormControl fullWidth variant="outlined" margin="dense" size="small" error={!!errorMessage}>
      <InputLabel id="theme">{label}</InputLabel>
      <Select
        fullWidth
        inputRef={ref}
        labelId="theme"
        id="theme"
        name="theme"
        defaultValue={"0"}
        value={value}
        label={label}
        aria-sort="none"
        onChange={props.onChange as (event: SelectChangeEvent) => void | undefined}
      >
        {Object.entries(options)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([key, option]) => (
            <MenuItem key={key} value={key}>
              {option}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
});
