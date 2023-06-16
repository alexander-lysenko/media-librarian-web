import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";

import { CustomInputProps } from "../../core/types";
import { forwardRef } from "react";
import { SxProps } from "@mui/system";

export const DateTimeInput = forwardRef((props: CustomInputProps, ref) => {
  const { label, name, value, errorMessage, helperText, onBlur, onChange } = props;

  const onCalendarClick = () => false;
  const inputSx: SxProps = { textAlign: "right" };

  return (
    <FormControl fullWidth size="small" margin="dense" error={!!errorMessage}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        type="date"
        label={label}
        id={name}
        name={name}
        // defaultValue={new Date().toDateString()}
        size="small"
        inputProps={{ sx: inputSx }}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ cursor: "pointer" }}
            onClick={onCalendarClick}
            children={<CalendarMonthOutlinedIcon />}
          ></InputAdornment>
        }
      />
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
});
