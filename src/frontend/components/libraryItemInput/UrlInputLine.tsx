import { PublicOutlined } from "@mui/icons-material";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { UrlInputProps } from "../../core/types";
import type { ChangeEvent } from "react";

/**
 * Library Item Form - Single Line Text Input for URL
 * Click on endAdornment icon opens the link in a new tab
 */
export const UrlInputLine = forwardRef((props: UrlInputProps, ref) => {
  const { t } = useTranslation();
  const [stateValue, setStateValue] = useState<string>(props.value as string);

  const { label, errorMessage, helperText, name, onBlur, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStateValue(event.currentTarget.value);
    onChange && onChange(event);
  };

  const endAdornment = (
    <InputAdornment
      position="end"
      sx={{ cursor: "pointer" }}
      disablePointerEvents={!!errorMessage}
      onClick={() => !!stateValue && !errorMessage && window.open(stateValue, "_blank")}
    >
      <Tooltip title={t("common.openInNewTab")} placement="left" arrow children={<PublicOutlined />} />
    </InputAdornment>
  );

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      fullWidth
      size="small"
      margin="dense"
      autoComplete="off"
      spellCheck="false"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onChange={handleChange}
      onBlur={onBlur}
      InputProps={{ endAdornment }}
    />
  );
});
