import { InputAdornment, TextField } from '@mui/material';

import { AlternateEmailOutlined, HourglassBottomOutlined } from '../icons';

import type { InputCustomProps } from '../../core/types';
import type { TextFieldProps } from '@mui/material';

interface Props extends InputCustomProps {
  margin?: TextFieldProps['margin'];
  disabled?: TextFieldProps['disabled'];
  loadingState?: boolean;
  disableAutoComplete?: boolean;
}

/**
 * Common input for e-mail address
 * Supports debounced validation and is able to use loading state
 */
export const EmailInput = (props: Props) => {
  const { label, errorMessage, helperText, name, onBlur, onChange, ref } = props;
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
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      size='small'
      margin={margin || 'dense'}
      fullWidth={fullWidth ?? true}
      autoComplete={disableAutoComplete ? 'off' : 'email'}
      disabled={disabled}
      autoFocus={autoFocus}
      onChange={onChange}
      onBlur={onBlur}
      slotProps={{ input: { endAdornment } }}
    />
  );
};
