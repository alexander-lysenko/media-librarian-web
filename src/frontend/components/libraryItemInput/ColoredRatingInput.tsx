import { FormControl, FormControlLabel, FormHelperText, Rating, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { ratingColorByValue } from '../../core';

import type { ColoredRatingInputProps } from '../../core/types';
import type { SxProps } from '@mui/system';
import type { SyntheticEvent } from 'react';
import type { UseControllerReturn } from 'react-hook-form';

/**
 * Library Item Form - Colored Rating Input
 * Supports cleaning value by the second click on the last active star (or double-click on any star).
 * It applies the color automatically depending on the ratio (input's value / star count):
 * - "gray" - ratio is 0, or value is undefined
 * - "red" - ratio is under 0.5
 * - "yellow" - ratio is between 0.5 - 0.89
 * - "green" - ratio is 0.9 and more
 */
export const ColoredRatingInput = (props: ColoredRatingInputProps) => {
  const { label, errorMessage, helperText, size, precision } = props;
  const { name, control } = props;

  const theme = useTheme();
  const smallViewport = useMediaQuery(theme.breakpoints.down('sm'));

  const [hover, setHover] = useState(-1);
  const [stateValue, setStateValue] = useState<number | null>(null);

  const generateInputSx = (value: number): SxProps => ({
    mr: 2,
    color: ratingColorByValue(value || 0, size),
    '&:hover': { color: ratingColorByValue(hover, size) },
  });

  const handleHover = (event: SyntheticEvent, newHover: number) => {
    event.preventDefault();
    setHover(newHover);
  };

  return (
    <FormControl fullWidth size='small' margin='dense' error={!!errorMessage}>
      <Controller
        name={name}
        control={control}
        render={({ field }: UseControllerReturn) => (
          <FormControlLabel
            label={label}
            labelPlacement='start'
            sx={{ justifyContent: 'space-between', ml: 0 }}
            slotProps={{
              typography: { noWrap: true },
            }}
            control={
              <Rating
                ref={field.ref}
                name={field.name}
                value={field.value}
                max={size}
                sx={generateInputSx(stateValue || field.value)}
                precision={precision}
                size={smallViewport ? 'small' : 'medium'}
                onBlur={field.onBlur}
                onChangeActive={handleHover}
                onChange={(event, newValue) => {
                  field.onChange(Number(newValue));
                  setStateValue(Number(newValue));
                }}
              />
            }
          />
        )}
      />
      <FormHelperText>{errorMessage || helperText}</FormHelperText>
    </FormControl>
  );
};
