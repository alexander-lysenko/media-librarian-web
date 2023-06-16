import { TextField } from "@mui/material";
import { forwardRef } from "react";

import { CustomInputProps } from "../../core/types";

/**
 * Library Item Form - Single Line Text Input
 * Auto-sized by height, dynamically resizes within 5-20 text rows
 */
export const TextInputMultiLine = forwardRef((props: CustomInputProps, ref) => {
  const { label, name, value, errorMessage, helperText, onBlur, onChange } = props;

  return (
    <TextField
      inputRef={ref}
      fullWidth
      multiline
      minRows={5}
      maxRows={20}
      id={name}
      label={label}
      name={name}
      value={value}
      size="small"
      margin="normal"
      autoComplete="off"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
});
