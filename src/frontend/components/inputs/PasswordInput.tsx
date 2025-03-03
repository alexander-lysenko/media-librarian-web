import { InputAdornment, TextField } from "@mui/material";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { VisibilityOffOutlined, VisibilityOutlined } from "../icons";

import type { InputCustomProps } from "../../core/types";
import type { TextFieldProps } from "@mui/material";

type Props = InputCustomProps & {
  margin?: TextFieldProps["margin"];
};

/**
 * Common Input for Password.
 * Supports interactive "Hold to see the password" action on click and hold by endAdornment icon
 */
export const PasswordInput = forwardRef((props: Props, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;
  const { autoFocus } = props;

  const { t } = useTranslation();
  const [passVisible, setPassVisible] = useState<boolean>(false);

  const handlePassVisible = () => setPassVisible(true);
  const handlePassHide = () => setPassVisible(false);
  const togglePassVisible = () => setPassVisible(!passVisible);

  const endAdornment = (
    <InputAdornment
      position="end"
      sx={{ cursor: "pointer" }}
      title={t("common.holdToSeePass")}
      onMouseDown={handlePassVisible}
      onMouseUp={handlePassHide}
      onMouseLeave={handlePassHide}
      onTouchStart={togglePassVisible}
      children={passVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
    />
  );

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      type={passVisible ? "text" : "password"}
      size="small"
      margin="normal"
      fullWidth={props.fullWidth ?? true}
      autoComplete="off"
      autoFocus={autoFocus}
      onChange={onChange}
      onBlur={onBlur}
      slotProps={{ input: { endAdornment } }}
    />
  );
});
