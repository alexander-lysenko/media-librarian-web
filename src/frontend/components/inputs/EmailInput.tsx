import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

import { AlternateEmailOutlined, HourglassBottomOutlined } from '../icons';

import type { InputCustomProps } from '../../core/types';

type Props = InputCustomProps & {
  margin?: TextFieldProps['margin'];
  disabled?: TextFieldProps['disabled'];
  loadingState?: boolean;
  disableAutoComplete?: boolean;
};

/**
 * Common input for e-mail address
 * Supports debounced validation and is able to use loading state
 */
export const EmailInput = forwardRef((props: Props, ref) => {
  const { label, errorMessage, helperText, name, onBlur, onChange } = props;
  const { margin, loadingState, disableAutoComplete, autoFocus, fullWidth, disabled } = props;

  const endAdornment = (
    <InputAdornment position='end'>
      {loadingState ? <HourglassBottomOutlined /> : <AlternateEmailOutlined />}
    </InputAdornment>
  );

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      helperText={errorMessage || helperText}
      error={!!errorMessage}
      fullWidth={fullWidth ?? true}
      size='small'
      margin={margin || 'dense'}
      autoComplete={disableAutoComplete ? 'off' : 'email'}
      autoFocus={autoFocus}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      slotProps={{ input: { endAdornment } }}
    />
  );
});
