import { TextField } from '@mui/material';
import { kebabCase } from 'lodash-es';

import type { TextInputMultiLineProps } from '../../core/types';

/**
 * Library Item Form - Single Line Text Input
 * Auto-sized by height, dynamically resizes within 5-20 text rows
 */
export const TextInputMultiLine = (props: TextInputMultiLineProps) => {
  const { label, errorMessage, helperText, name, onBlur, onChange, ref } = props;
  const inputId = kebabCase(name);

  return (
    <TextField
      inputRef={ref}
      name={name}
      label={label}
      fullWidth
      multiline
      minRows={5}
      maxRows={20}
      size='small'
      margin='dense'
      autoComplete='off'
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      onBlur={onBlur}
      onChange={onChange}
      slotProps={{
        inputLabel: { htmlFor: inputId },
        input: { id: inputId },
      }}
    />
  );
};
