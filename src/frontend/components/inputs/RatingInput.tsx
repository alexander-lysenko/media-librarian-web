import { FormControl, FormHelperText, InputLabel, Rating } from "@mui/material";

import { CustomInputProps } from "../../core/types";

type OverriddenProps = { value?: number };

export const RatingInput = (props: CustomInputProps & OverriddenProps) => {
  const { label, name, value, errorMessage, helperText, onBlur, onChange } = props;

  return (
    <FormControl fullWidth size="small" margin="dense" error={!!errorMessage}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Rating value={value} size={"small"} />
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
};
