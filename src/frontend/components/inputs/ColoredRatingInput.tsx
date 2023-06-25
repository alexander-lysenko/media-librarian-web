import { FormControl, FormControlLabel, FormHelperText, Rating, useMediaQuery, useTheme } from "@mui/material";
import { SxProps } from "@mui/system";
import { forwardRef, useState } from "react";
import { Controller } from "react-hook-form";

import { ratingColorByValue } from "../../core";
import { ColoredRatingInputProps } from "../../core/types";

/**
 * Library Item Form - Colored Rating Input
 * Supports setting value as null by second click on active star
 * The color is auto applied by value:
 * - "red" - ratio is under 0.5
 * - "yellow" - ratio is between 0.5 - 0.89
 * - "green" - ratio is 0.9 and up
 */
export const ColoredRatingInput = forwardRef((props: ColoredRatingInputProps, ref) => {
  const { label, name, errorMessage, helperText } = props;
  const { size, precision } = props;
  const { control, setValue } = props;

  const theme = useTheme();
  const smallViewport = useMediaQuery(theme.breakpoints.down("sm"));

  const [hover, setHover] = useState(-1);
  const [stateValue, setStateValue] = useState<number | null>(0);

  const inputSx: SxProps = {
    mr: 2,
    color: ratingColorByValue(stateValue || 0, size),
    "&:hover": { color: ratingColorByValue(hover, size) },
  };

  return (
    <FormControl fullWidth size="small" margin="dense" error={!!errorMessage}>
      <FormControlLabel
        ref={ref}
        label={label}
        labelPlacement="start"
        sx={{ justifyContent: "space-between", ml: 0 }}
        control={
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Rating
                ref={field.ref}
                id={field.name}
                name={field.name}
                value={stateValue}
                max={size}
                sx={inputSx}
                precision={precision}
                size={smallViewport ? "small" : "medium"}
                onBlur={field.onBlur}
                // onChange={renderProps.field.onChange}
                onChange={(event, newValue) => {
                  // Hack to set value around the controlled input
                  setValue && setValue(field.name, Number(newValue));
                  setStateValue(Number(newValue));
                }}
                onChangeActive={(event, newHover) => {
                  event.preventDefault();
                  setHover(newHover);
                }}
              />
            )}
          />
        }
      />
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
});
