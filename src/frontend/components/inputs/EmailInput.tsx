import { AlternateEmailOutlined, HourglassBottomOutlined } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { forwardRef } from "react";

import { InputCustomProps } from "../../core/types";

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

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      helperText={errorMessage || helperText}
      error={!!errorMessage}
      fullWidth
      size="small"
      margin="dense"
      autoComplete={disableAutoComplete ? "off" : "email"}
      autoFocus={autoFocus}
      onChange={onChange}
      onBlur={onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {loadingState ? <HourglassBottomOutlined /> : <AlternateEmailOutlined />}
          </InputAdornment>
        ),
      }}
    />
  );
});
