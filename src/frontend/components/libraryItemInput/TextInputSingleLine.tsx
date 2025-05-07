import { InputAdornment, TextField } from '@mui/material';

import { DriveFileRenameOutlineOutlined, HourglassBottomOutlined } from '../icons';

import type { TextInputSingleLineProps } from '../../core/types';

/**
 * Library Item Form - Single Line Text Input
 * Supports active (loading) state, by which the endAdornment icon changes
 */
export const TextInputSingleLine = (props: TextInputSingleLineProps) => {
  const { label, errorMessage, helperText, name, onBlur, onChange, ref } = props;
  const { loadingState = false } = props;

  const endAdornment = (
    <InputAdornment position='end'>
      {loadingState ? <HourglassBottomOutlined /> : <DriveFileRenameOutlineOutlined />}
    </InputAdornment>
  );

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      fullWidth
      size='small'
      margin='dense'
      autoComplete='off'
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onBlur={onBlur}
      onChange={onChange}
      slotProps={{ input: { endAdornment } }}
    />
  );
};
