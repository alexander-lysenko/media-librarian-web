import { ChangeHandler, Control, FieldValues, UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

import { LibraryElementEnum } from "../enums";

export type InputCustomProps = Omit<UseFormRegisterReturn, "onChange"> & {
  label: string;
  value?: string;
  helperText?: string;
  errorMessage?: string;
  onChange?: ChangeHandler;
};

type FormControlProps = {
  control: Control;
  setValue: UseFormSetValue<FieldValues>;
};

type LoadingProps = {
  loadingState?: boolean;
};

type DateInputProps = FormControlProps & {
  type: "date" | "datetime";
};

type RatingProps = FormControlProps & {
  precision: 0.5 | 1;
  size: 5 | 10;
};

export type TextInputSingleLineProps = InputCustomProps & LoadingProps;
export type TextInputMultiLineProps = InputCustomProps;
export type DateTimeInputProps = InputCustomProps & DateInputProps;
export type ColoredRatingInputProps = InputCustomProps & RatingProps;
export type PriorityInputProps = InputCustomProps & { control: Control };
export type CheckBoxedInputProps = InputCustomProps & { control: Control };
export type UrlInputProps = InputCustomProps;

type RelatedInputProps<T extends keyof typeof LibraryElementEnum> = { type: T };

export type LibraryInputNarrowProps =
  | (RelatedInputProps<"line"> & InputCustomProps & LoadingProps)
  | (RelatedInputProps<"text"> & InputCustomProps)
  | (RelatedInputProps<"date"> & InputCustomProps & DateInputProps)
  | (RelatedInputProps<"datetime"> & InputCustomProps & DateInputProps)
  | (RelatedInputProps<"rating5"> & InputCustomProps & RatingProps)
  | (RelatedInputProps<"rating5precision"> & InputCustomProps & RatingProps)
  | (RelatedInputProps<"rating10"> & InputCustomProps & RatingProps)
  | (RelatedInputProps<"rating10precision"> & InputCustomProps & RatingProps)
  | (RelatedInputProps<"priority"> & InputCustomProps)
  | (RelatedInputProps<"switch"> & InputCustomProps)
  | (RelatedInputProps<"url"> & InputCustomProps);
