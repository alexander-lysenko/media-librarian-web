import { ChangeEvent, FocusEvent, SyntheticEvent } from "react";

export interface CustomInputProps {
  name: string;
  label: string;
  value?: string;
  helperText?: string;
  errorMessage?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
