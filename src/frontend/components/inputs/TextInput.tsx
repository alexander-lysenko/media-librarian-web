import { DriveFileRenameOutlineOutlined, SvgIconComponent } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { forwardRef, ReactElement } from "react";

import { InputCustomProps } from "../../core/types";

type Props = InputCustomProps & {
  autocomplete?: string;
  icon?: ReactElement<SvgIconComponent>;
};

/**
 * Common single-line text input.
 * Supports switchable native autocomplete and customizable end adornment icon
 */
export const TextInput = forwardRef((props: Props, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;
  const { autoFocus, autocomplete, icon } = props;

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      fullWidth
      size="small"
      margin="dense"
      autoComplete={autocomplete || "off"}
      autoFocus={autoFocus}
      onChange={onChange}
      onBlur={onBlur}
      InputProps={{
        endAdornment: <InputAdornment position="end" children={icon ?? <DriveFileRenameOutlineOutlined />} />,
      }}
    />
  );
});
