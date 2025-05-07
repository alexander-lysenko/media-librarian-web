import { MenuItem, TextField } from '@mui/material';

import type { InputCustomProps } from '../../core/types';
import type { SvgIconComponent } from '@mui/icons-material';
import type { TextFieldProps } from '@mui/material';
import type { ReactElement, ReactNode } from 'react';

interface Props extends InputCustomProps {
  disabled?: TextFieldProps['disabled'];
  icon?: ReactElement<SvgIconComponent>;
  margin?: TextFieldProps['margin'];
  items: Record<string | number, ReactNode>;
}

/**
 * Renders a customizable select input field using a Material-UI `TextField` with the ` select ` property enabled.
 * This component allows rendering a dropdown selection menu with provided options and supports
 * additional customization and event handling.
 */
export const SelectInput = (props: Props) => {
  const { label, errorMessage, helperText, name, margin, autoFocus, disabled, onBlur, onChange, ref } = props;
  const { value, items } = props;

  return (
    <TextField
      select
      inputRef={ref}
      name={name}
      value={value}
      label={label}
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      fullWidth={props.fullWidth ?? true}
      size='small'
      margin={margin || 'dense'}
      autoFocus={autoFocus}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
    >
      {Object.entries(items).map(([key, definition]) => (
        <MenuItem key={key} value={key} children={definition} />
      ))}
    </TextField>
  );
};
