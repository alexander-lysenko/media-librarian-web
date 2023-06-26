import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DateOrTimeView, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePickerSlotsComponentsProps } from "@mui/x-date-pickers/DateTimePicker/DateTimePicker.types";
import dayjs, { Dayjs } from "dayjs";
import { Controller, UseControllerReturn } from "react-hook-form";

import { DateTimeInputProps } from "../../core/types";

/**
 * Library Item Form - Date/DateTime Input
 * Uses MUI X DateTimePicker and Dayjs library
 */
export const DateTimeInput = (props: DateTimeInputProps) => {
  const { label, errorMessage, helperText, type } = props;
  const { name, control } = props;

  const slotProps: DateTimePickerSlotsComponentsProps<Dayjs> = {
    textField: {
      helperText: errorMessage || helperText,
      fullWidth: true,
      size: "small",
      margin: "dense",
    },
    openPickerButton: { sx: { mr: -1 } },
  };

  const viewByType: Record<DateTimeInputProps["type"], DateOrTimeView[]> = {
    date: ["year", "month", "day"],
    datetime: ["year", "month", "day", "hours", "minutes", "seconds"],
  };
  const inputFormatByType: Record<DateTimeInputProps["type"], string> = {
    date: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD HH:mm:ss",
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field }: UseControllerReturn) => (
          <DateTimePicker
            inputRef={field.ref}
            label={label}
            value={dayjs(field.value, field.value && inputFormatByType[type])}
            onClose={field.onBlur}
            onChange={(value: Dayjs | null) => {
              field.onChange(value?.format(inputFormatByType[type]));
            }}
            defaultValue={dayjs()}
            ampm={false}
            views={viewByType[type]}
            slotProps={slotProps}
            slots={{ openPickerIcon: CalendarMonthOutlinedIcon }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
