
export interface CustomInputProps {
  name: string;
  label: string;
  value?: string;
  helperText?: string;
  errorMessage?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
