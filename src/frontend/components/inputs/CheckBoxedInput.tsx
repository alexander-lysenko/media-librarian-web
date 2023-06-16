import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from "@mui/material";
import { ChangeEvent, useState } from "react";

import { CustomInputProps } from "../../core/types";

export const CheckBoxedInput = (props: CustomInputProps) => {
  const { label, name, value, errorMessage, helperText } = props;

  const [checked, setChecked] = useState<boolean>(!!value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <FormControl variant={"standard"} error={!!errorMessage}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              value={true}
              checked={checked}
              inputProps={{ "aria-label": "controlled" }}
              onChange={handleChange}
            />
          }
          label={label}
        />
      </FormGroup>
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
};
