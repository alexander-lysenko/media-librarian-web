import "dayjs/locale/en";
import "dayjs/locale/ru";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DateOrTimeView, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePickerSlotsComponentsProps } from "@mui/x-date-pickers/DateTimePicker/DateTimePicker.types";
import { PickersInputComponentLocaleText } from "@mui/x-date-pickers/locales/utils/pickersLocaleTextApi";
import dayjs, { Dayjs } from "dayjs";
import { Controller, UseControllerReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DateTimeInputProps } from "../../core/types";
import { useLanguageStore } from "../../store/useTranslationStore";

/**
 * Library Item Form - Date/DateTime Input
 * Uses MUI X DateTimePicker and Dayjs library
 */
export const DateTimeInput = (props: DateTimeInputProps) => {
  const { label, errorMessage, helperText, type } = props;
  const { name, control } = props;
  const { t } = useTranslation();
  const locale = useLanguageStore((state) => state.getLanguage());

  const slotProps: DateTimePickerSlotsComponentsProps<Dayjs> = {
    textField: {
      helperText: errorMessage || helperText,
      fullWidth: true,
      size: "small",
      margin: "dense",
    },
    openPickerButton: { sx: { mr: -1 } },
    actionBar: {
      actions: ["today", "cancel", "accept"],
    },
  };

  const viewByType: Record<DateTimeInputProps["type"], DateOrTimeView[]> = {
    date: ["year", "month", "day"],
    datetime: ["year", "month", "day", "hours", "minutes", "seconds"],
  };
  const inputFormatByType: Record<DateTimeInputProps["type"], string> = {
    date: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD HH:mm:ss",
  };

  const localeText: PickersInputComponentLocaleText<Dayjs> = {
    toolbarTitle: t(`dateTimePicker.toolbarTitle.${type}`),
    previousMonth: t("dateTimePicker.previousMonth"),
    nextMonth: t("dateTimePicker.nextMonth"),
    todayButtonLabel: t("dateTimePicker.todayButtonLabel"),
    cancelButtonLabel: t("dateTimePicker.cancelButtonLabel"),
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <Controller
        name={name}
        control={control}
        render={({ field }: UseControllerReturn) => (
          <DateTimePicker
            inputRef={field.ref}
            label={label}
            value={dayjs(field.value, field.value && inputFormatByType[type])}
            defaultValue={dayjs()}
            ampm={false}
            views={viewByType[type]}
            localeText={localeText}
            slotProps={slotProps}
            slots={{ openPickerIcon: CalendarMonthOutlinedIcon }}
            onClose={field.onBlur}
            onChange={(value: Dayjs | null) => {
              field.onChange(value?.format(inputFormatByType[type]));
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
