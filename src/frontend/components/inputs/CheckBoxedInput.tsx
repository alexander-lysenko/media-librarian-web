import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";

import { CheckBoxedInputProps } from "../../core/types";

/**
 * Library Item Form - Switch (Checkbox) Input
 */
export const CheckBoxedInput = forwardRef((props: CheckBoxedInputProps, ref) => {
  const { label, name, errorMessage, helperText, control } = props;

  return (
    <FormControl fullWidth margin="dense" error={!!errorMessage}>
      <FormControlLabel
        ref={ref}
        label={label}
        control={
          <Controller
            name={name}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Checkbox inputRef={field.ref} name={field.name} checked={!!field.value} onChange={field.onChange} />
            )}
          />
        }
      />
      <FormHelperText variant={"outlined"}>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
});
