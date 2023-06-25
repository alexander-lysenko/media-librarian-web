import { FormControl, FormControlLabel, FormHelperText, Rating, useMediaQuery, useTheme } from "@mui/material";
import { SxProps } from "@mui/system";
import { SyntheticEvent, useState } from "react";
import { Controller, UseControllerReturn } from "react-hook-form";

import { ratingColorByValue } from "../../core";
import { ColoredRatingInputProps } from "../../core/types";

/**
 * Library Item Form - Colored Rating Input
 * Supports setting value as null by second click on active star
 * The color is auto applied by value:
 * - "red" - ratio is under 0.5
 * - "yellow" - ratio is between 0.5 - 0.89
 * - "green" - ratio is 0.9 and up
 * TODO: FIX undefined pristine state
 */
export const ColoredRatingInput = (props: ColoredRatingInputProps) => {
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
        control={
          <Controller
            name={name}
            control={control}
            defaultValue={stateValue}
            render={({ field }: UseControllerReturn) => (
              <Rating
                ref={field.ref}
                name={field.name}
                value={field.value}
                max={size}
                sx={inputSx}
                precision={precision}
                size={smallViewport ? "small" : "medium"}
                onBlur={field.onBlur}
                onChangeActive={handleHover}
                onChange={(event, newValue) => {
                  // Hack to set value around the controlled input
                  // setValue && setValue(field.name, Number(newValue));
                  field.value = Number(newValue);
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
