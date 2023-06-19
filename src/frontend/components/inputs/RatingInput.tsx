import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, forwardRef, useState } from "react";

import { CustomInputProps } from "../../core/types";
import { ratingColorByValue } from "../../core";

type OverriddenProps = {
  precision: 0.5 | 1;
  size: 5 | 10;
  value?: number;
};

export const RatingInput = forwardRef((props: CustomInputProps & OverriddenProps, ref) => {
  const { label, name, value, errorMessage, helperText, size, precision, onBlur, onChange } = props;
  const [hover, setHover] = useState(-1);

  const theme = useTheme();
  const smallViewport = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FormControl fullWidth size="small" margin="dense" error={!!errorMessage}>
      <FormGroup>
        <FormControlLabel
          label={label}
          labelPlacement="start"
          sx={{ justifyContent: "space-between", ml: 0 }}
          control={
            <Rating
              size={smallViewport ? "small" : "medium"}
              value={value}
              id={name}
              max={size}
              precision={precision}
              ref={ref}
              sx={{
                mr: 2,
                color: ratingColorByValue(value || 0, size),
                "&:hover": { color: ratingColorByValue(hover, size) },
              }}
              onBlur={onBlur}
              onChange={(event) => {
                onChange?.(event as ChangeEvent<HTMLInputElement>);
              }}
              onChangeActive={(event, newHover) => {
                event.preventDefault();
                setHover(newHover);
              }}
            />
          }
        />
      </FormGroup>
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
});
