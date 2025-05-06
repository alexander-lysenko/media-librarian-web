import { InputAdornment, TextField } from '@mui/material';
import { forwardRef } from 'react';

import type { InputCustomProps } from '../../core/types';
import type { SvgIconComponent } from '@mui/icons-material';
import type { TextFieldProps } from '@mui/material';
import type { ReactElement } from 'react';

type Props = InputCustomProps & {
  autoComplete?: TextFieldProps['autoComplete'];
  disabled?: TextFieldProps['disabled'];
  icon?: ReactElement<SvgIconComponent>;
  margin?: TextFieldProps['margin'];
};

/**
 * Common single-line text input.
 * Supports switchable native autocomplete and customizable end adornment icon
 */
export const TextInput = forwardRef((props: Props, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;
  const { margin, autoFocus, autoComplete, icon, disabled } = props;

  const endAdornment = icon ? <InputAdornment position='end' children={icon} /> : undefined;

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      fullWidth={props.fullWidth ?? true}
      size='small'
      margin={margin || 'dense'}
      autoComplete={autoComplete || 'off'}
      autoFocus={autoFocus}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      slotProps={{
        input: { endAdornment },
        inputLabel: { shrink: true },
      }}
    />
  );
});
