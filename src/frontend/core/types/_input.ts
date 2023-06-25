import { ChangeHandler, Control, FieldValues, UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

import { LibraryElementEnum } from "../enums";

export type InputCustomProps = Omit<UseFormRegisterReturn, "onChange"> & {
  label: string;
  value?: string;
  helperText?: string;
  errorMessage?: string;
  onChange?: ChangeHandler;
};

type LoadingProps = {
  loadingState?: boolean;
};

type DateInputProps = {
  type: "date" | "datetime-local";
};

type RatingProps = {
  precision: 0.5 | 1;
  size: 5 | 10;
  control: Control;
  setValue: UseFormSetValue<FieldValues>;
};

export type TextInputSingleLineProps = InputCustomProps & LoadingProps;
export type TextInputMultiLineProps = InputCustomProps;
export type DateTimeInputProps = InputCustomProps & DateInputProps;
export type ColoredRatingInputProps = InputCustomProps & RatingProps;
export type PriorityInputProps = InputCustomProps;
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
