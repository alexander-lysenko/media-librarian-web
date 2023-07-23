import { SvgIconComponent } from "@mui/icons-material";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { forwardRef, ReactElement } from "react";

import { InputCustomProps } from "../../core/types";

type Props = InputCustomProps & {
  margin?: TextFieldProps["margin"];
  autoComplete?: TextFieldProps["autoComplete"];
  icon?: ReactElement<SvgIconComponent>;
};

/**
 * Common single-line text input.
 * Supports switchable native autocomplete and customizable end adornment icon
 */
export const TextInput = forwardRef((props: Props, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;
  const { margin, autoFocus, autoComplete, icon } = props;

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      fullWidth
      size="small"
      margin={margin || "dense"}
      autoComplete={autoComplete || "off"}
      autoFocus={autoFocus}
      onChange={onChange}
      onBlur={onBlur}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: icon ? <InputAdornment position="end" children={icon} /> : undefined,
      }}
    />
  );
});
