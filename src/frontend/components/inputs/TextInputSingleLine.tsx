import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import { InputAdornment, TextField } from "@mui/material";
import { forwardRef } from "react";

import { CustomInputProps } from "../../core/types";

type LoadingProps = {
  loadingState?: boolean;
};

/**
 * Library Item Form - Single Line Text Input
 * Supports active (loading) state, by which the endAdornment icon changes
 */
export const TextInputSingleLine = forwardRef((props: CustomInputProps & LoadingProps, ref) => {
  const { label, name, value, errorMessage, helperText, onBlur, onChange } = props;
  const { loadingState = false } = props;

  return (
    <TextField
      inputRef={ref}
      fullWidth
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
