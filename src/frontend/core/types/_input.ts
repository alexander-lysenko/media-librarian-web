import type { LibraryElement } from "./_library";
import type { Control, UseFormRegisterReturn } from "react-hook-form";

export interface InputCustomProps extends Omit<UseFormRegisterReturn, "ref"> {
  label: string;
  value?: string;
  helperText?: string;
  errorMessage?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
}

interface FormControlProps {
  control: Control;
}

interface LoadingProps {
  loadingState?: boolean;
}

interface DateInputProps extends FormControlProps {
  type: "date" | "datetime";
}

interface RatingProps extends FormControlProps {
  precision: 0.5 | 1;
  size: 5 | 10;
}

export type TextInputSingleLineProps = InputCustomProps & LoadingProps;
export type TextInputMultiLineProps = InputCustomProps;
export type DateTimeInputProps = InputCustomProps & DateInputProps;
export type ColoredRatingInputProps = InputCustomProps & RatingProps;
export type PriorityInputProps = InputCustomProps & { control: Control };
export type CheckBoxedInputProps = InputCustomProps & { control: Control };
export type UrlInputProps = InputCustomProps;

interface RelatedInputProps<T extends LibraryElement> {
  type: T;
}

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
  | (RelatedInputProps<"checkmark"> & InputCustomProps)
  | (RelatedInputProps<"url"> & InputCustomProps);
