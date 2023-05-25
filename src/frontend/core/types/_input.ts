import React from "react";

export interface CustomInputProps {
  name: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  helperText?: string;
  errorMessage?: string;
}
