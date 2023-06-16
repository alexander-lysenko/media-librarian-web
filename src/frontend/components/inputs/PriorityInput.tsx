import { FormControl, FormHelperText } from "@mui/material";

import { CustomInputProps } from "../../core/types";

export const PriorityInput = (props: CustomInputProps) => {
  const { label, name, value, errorMessage, helperText, onBlur, onChange } = props;
  return (
    <FormControl variant={"standard"} error={!!errorMessage}>
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
};
