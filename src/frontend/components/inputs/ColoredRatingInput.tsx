import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { ChangeEvent, forwardRef, useState } from "react";

import { ratingColorByValue } from "../../core";
import { CustomInputProps } from "../../core/types";

type OverriddenProps = {
  precision: 0.5 | 1;
  size: 5 | 10;
  value?: number;
};

export const ColoredRatingInput = forwardRef((props: CustomInputProps & OverriddenProps, ref) => {
  const { label, name, errorMessage, helperText, onBlur, onChange } = props;
  const { size, precision } = props;

  const theme = useTheme();
  const smallViewport = useMediaQuery(theme.breakpoints.down("sm"));

  const [hover, setHover] = useState(-1);
  const [value, setValue] = useState<number>(0);

  const inputSx: SxProps = {
    mr: 2,
    color: ratingColorByValue(value || 0, size),
    "&:hover": { color: ratingColorByValue(hover, size) },
  };

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
              sx={inputSx}
              onBlur={onBlur}
              onChange={(event, newValue) => {
                setValue(newValue as number);
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
