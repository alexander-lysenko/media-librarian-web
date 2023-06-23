import { ChangeEvent } from "react";
import { ChangeHandler, UseFormRegisterReturn } from "react-hook-form";

import { LibraryElementEnum } from "../enums";

type RelatedInputProps<T extends keyof typeof LibraryElementEnum> = { variant: T };

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
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  precision: 0.5 | 1;
  size: 5 | 10;
};

export type LibraryInputProps =
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
