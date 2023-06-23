import { TextField } from "@mui/material";
import { forwardRef } from "react";

import { LibraryInputProps } from "../../core/types";

type Props = LibraryInputProps & { variant: "text" };

/**
 * Library Item Form - Single Line Text Input
 * Auto-sized by height, dynamically resizes within 5-20 text rows
 */
export const TextInputMultiLine = forwardRef((props: Props, ref) => {
  const { label, name, errorMessage, helperText, onBlur, onChange } = props;

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
      size="small"
      margin="dense"
      autoComplete="off"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
});
