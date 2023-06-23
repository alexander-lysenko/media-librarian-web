import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { SxProps } from "@mui/system";
import { forwardRef } from "react";

import { LibraryInputProps } from "../../core/types";

type Props = LibraryInputProps & {
  variant: "date";
};

/**
 * Library Item Form - Date/DateTime Input
 * Native HTML5 date input, fits browser locale
 * TODO: Fix timezone
 */
export const DateTimeInput = forwardRef((props: Props, ref) => {
  const { label, name, errorMessage, helperText, onBlur, onChange } = props;
  const { variant } = props;

  const onCalendarClick = () => false;
  const inputSx: SxProps = { textAlign: "right" };
  const dateSlice = variant === "date" ? 10 : 16;

  return (
    <FormControl fullWidth size="small" margin="dense" error={!!errorMessage}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        inputRef={ref}
        type={variant}
        label={label}
        id={name}
        name={name}
        // todo: rework default date to get time from actual timezone
        defaultValue={new Date().toISOString().slice(0, dateSlice)}
        size="small"
        inputProps={{ sx: inputSx }}
        onBlur={onBlur}
        onChange={onChange}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ cursor: "pointer" }}
            onClick={onCalendarClick}
            children={<CalendarMonthOutlinedIcon />}
          />
        }
      />
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
});
