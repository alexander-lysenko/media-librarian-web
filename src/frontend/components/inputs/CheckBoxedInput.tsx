import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import { ChangeEvent, forwardRef, useState } from "react";

import { CustomInputProps } from "../../core/types";

export const CheckBoxedInput = forwardRef<HTMLInputElement, CustomInputProps>(
  // prettier ignore
  (props: CustomInputProps, ref) => {
    const { label, name, value, errorMessage, helperText, onChange } = props;
    const [checked, setChecked] = useState<boolean>(!!value);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      setChecked(event.target.checked);
    };

    return (
      <FormControl variant="standard" margin="dense" error={!!errorMessage}>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              value={value}
              checked={checked}
              inputProps={{ "aria-label": "controlled" }}
              onChange={handleChange}
              inputRef={ref}
            />
          }
          label={label}
        />
        <FormHelperText variant={"outlined"}>{errorMessage || helperText}</FormHelperText>
      </FormControl>
    );
  },
);
