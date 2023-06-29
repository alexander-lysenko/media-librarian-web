import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";

import { CheckBoxedInputProps } from "../../core/types";

/**
 * Library Item Form - Switch (Checkbox) Input
 */
export const CheckBoxedInput = (props: CheckBoxedInputProps) => {
  const { label, errorMessage, helperText } = props;
  const { name, control } = props;

  return (
    <FormControl fullWidth margin="dense" error={!!errorMessage}>
      <FormControlLabel
        label={label}
        control={
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Checkbox inputRef={field.ref} name={field.name} checked={!!field.value} onChange={field.onChange} />
            )}
          />
        }
      />
      <FormHelperText variant={"outlined"}>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
};
