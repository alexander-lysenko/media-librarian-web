import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { ChangeEvent, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { UrlInputProps } from "../../core/types";

/**
 * Library Item Form - Single Line Text Input for URL
 * Click on endAdornment icon opens the link in a new tab
 */
export const UrlInputLine = forwardRef((props: UrlInputProps, ref) => {
  const { t } = useTranslation();
  const [stateValue, setStateValue] = useState<string>(props.value as string);

  const { label, name, errorMessage, helperText, onBlur, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStateValue(event.currentTarget.value);
    onChange && onChange(event);
  };

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
      spellCheck="false"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onChange={handleChange}
      onBlur={onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{ cursor: "pointer" }}
            disablePointerEvents={!!errorMessage}
            onClick={() => !!stateValue && !errorMessage && window.open(stateValue, "_blank")}
          >
            <Tooltip title={t("common.openInNewTab")} placement="left" arrow>
              <PublicOutlinedIcon />
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
});
