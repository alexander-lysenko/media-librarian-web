import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { InputAdornment, TextField } from "@mui/material";
import { forwardRef } from "react";

import { UrlInputProps } from "../../core/types";

/**
 * Library Item Form - Single Line Text Input for URL
 * Click on endAdornment icon opens the link in a new tab
 */
export const UrlInputLine = forwardRef((props: UrlInputProps, ref) => {
  const { label, name, errorMessage, helperText, onBlur, onChange } = props;

  return (
    <TextField
      inputRef={ref}
      fullWidth
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
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={() => window.open("", "_blank")}>
            <PublicOutlinedIcon />
          </InputAdornment>
        ),
      }}
    />
  );
});
