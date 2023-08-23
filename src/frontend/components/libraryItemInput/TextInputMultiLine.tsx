import { TextField } from "@mui/material";
import { forwardRef } from "react";

import type { TextInputMultiLineProps } from "../../core/types";

/**
 * Library Item Form - Single Line Text Input
 * Auto-sized by height, dynamically resizes within 5-20 text rows
 */
export const TextInputMultiLine = forwardRef((props: TextInputMultiLineProps, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      fullWidth
      multiline
      minRows={5}
      maxRows={20}
      size="small"
      margin="dense"
      autoComplete="off"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
});
