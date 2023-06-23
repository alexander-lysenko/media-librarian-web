import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import { ChangeEvent, forwardRef, Ref, useState } from "react";

import { LibraryInputProps } from "../../core/types";

type Props = LibraryInputProps & { variant: "switch" };

/**
 * Library Item Form - Switch (Checkbox) Input
 *
 */
export const CheckBoxedInput = forwardRef(
  // prettier ignore
  (props: Props, ref) => {
    const { label, name, errorMessage, helperText, onChange } = props;
    const [checked, setChecked] = useState<boolean>(false);

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
              checked={checked}
              inputProps={{ "aria-label": "controlled" }}
              onChange={handleChange}
              inputRef={ref as Ref<HTMLInputElement>}
            />
          }
          label={label}
        />
        <FormHelperText variant={"outlined"}>{errorMessage || helperText}</FormHelperText>
      </FormControl>
    );
  },
);
