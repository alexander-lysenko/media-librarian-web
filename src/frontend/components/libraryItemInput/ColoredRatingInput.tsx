import { FormControl, FormControlLabel, FormHelperText, Rating, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";

import { ratingColorByValue } from "../../core";

import type { ColoredRatingInputProps } from "../../core/types";
import type { SxProps } from "@mui/system";
import type { SyntheticEvent } from "react";
import type { UseControllerReturn } from "react-hook-form";

/**
 * Library Item Form - Colored Rating Input
 * Supports setting value as null by second click on active star
 * The color is auto applied by value:
 * - "red" - ratio is under 0.5
 * - "yellow" - ratio is between 0.5 - 0.89
 * - "green" - ratio is 0.9 and up
 */
export const ColoredRatingInput = (props: ColoredRatingInputProps) => {
  const { label, errorMessage, helperText, size, precision } = props;
  const { name, control } = props;

  const theme = useTheme();
  const smallViewport = useMediaQuery(theme.breakpoints.down("sm"));

  const [hover, setHover] = useState(-1);
  const [stateValue, setStateValue] = useState<number | null>(null);

  const generateInputSx = (value: number): SxProps => ({
    mr: 2,
    color: ratingColorByValue(value || 0, size),
    "&:hover": { color: ratingColorByValue(hover, size) },
  });

  const handleHover = (event: SyntheticEvent, newHover: number) => {
    event.preventDefault();
    setHover(newHover);
  };

  return (
    <FormControl fullWidth size="small" margin="dense" error={!!errorMessage}>
      <FormControlLabel
        label={label}
        labelPlacement="start"
        sx={{ justifyContent: "space-between", ml: 0 }}
        slotProps={{
          typography: { noWrap: true },
        }}
        control={
          <Controller
            name={name}
            control={control}
            render={({ field }: UseControllerReturn) => (
              <Rating
                ref={field.ref}
                name={field.name}
                value={field.value}
                max={size}
                sx={generateInputSx(stateValue || field.value)}
                precision={precision}
                size={smallViewport ? "small" : "medium"}
                onBlur={field.onBlur}
                onChangeActive={handleHover}
                onChange={(event, newValue) => {
                  field.onChange(Number(newValue));
                  setStateValue(Number(newValue));
                }}
              />
            )}
          />
        }
      />
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
};
