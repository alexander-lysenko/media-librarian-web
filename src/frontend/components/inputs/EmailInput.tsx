import { InputAdornment, TextField } from "@mui/material";
import { forwardRef } from "react";

import { AlternateEmailOutlined, HourglassBottomOutlined } from "../icons";

import type { InputCustomProps } from "../../core/types";

type Props = InputCustomProps & {
  loadingState?: boolean;
  disableAutoComplete?: boolean;
};

/**
 * Common input for e-mail address
 * Supports debounced validation and is able to use loading state
 */
export const EmailInput = forwardRef((props: Props, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;
  const { loadingState, disableAutoComplete, autoFocus } = props;

  const endAdornment = (
    <InputAdornment position="end">
      {loadingState ? <HourglassBottomOutlined /> : <AlternateEmailOutlined />}
    </InputAdornment>
  );

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      helperText={errorMessage || helperText}
      error={!!errorMessage}
      fullWidth={props.fullWidth ?? true}
      size="small"
      margin="dense"
      autoComplete={disableAutoComplete ? "off" : "email"}
      autoFocus={autoFocus}
      onChange={onChange}
      onBlur={onBlur}
      slotProps={{ input: { endAdornment } }}
    />
  );
});
