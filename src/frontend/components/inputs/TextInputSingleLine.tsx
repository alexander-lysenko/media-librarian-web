import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import { InputAdornment, TextField } from "@mui/material";
import { forwardRef } from "react";

import { TextInputSingleLineProps } from "../../core/types";

/**
 * Library Item Form - Single Line Text Input
 * Supports active (loading) state, by which the endAdornment icon changes
 */
export const TextInputSingleLine = forwardRef((props: TextInputSingleLineProps, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;
  const { loadingState = false } = props;

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      fullWidth
      size="small"
      margin="dense"
      autoComplete="off"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onBlur={onBlur}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {loadingState ? <HourglassBottomOutlinedIcon /> : <DriveFileRenameOutlineOutlinedIcon />}
          </InputAdornment>
        ),
      }}
    />
  );
});
