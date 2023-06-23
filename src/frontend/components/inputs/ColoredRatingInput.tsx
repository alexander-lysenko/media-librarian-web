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
import { forwardRef, useState } from "react";

import { ratingColorByValue } from "../../core";
import { LibraryInputProps } from "../../core/types";

type Props = LibraryInputProps & { variant: "rating5" };

/**
 *
 */
export const ColoredRatingInput = forwardRef((props: Props, ref) => {
  const { label, name, errorMessage, helperText, onBlur, onChange } = props;
  const { size, precision } = props;

  const theme = useTheme();
  const smallViewport = useMediaQuery(theme.breakpoints.down("sm"));

  const [hover, setHover] = useState(-1);
  const [stateValue, setStateValue] = useState<number>(0);

  const inputSx: SxProps = {
    mr: 2,
    color: ratingColorByValue(stateValue || 0, size),
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
              ref={ref}
              size={smallViewport ? "small" : "medium"}
              id={name}
              max={size}
              precision={precision}
              sx={inputSx}
              defaultValue={0}
              onBlur={onBlur}
              onChange={(event, newValue) => {
                setStateValue(newValue as number);
                onChange(event);
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
