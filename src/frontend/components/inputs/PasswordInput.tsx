import { InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { VisibilityOffOutlined, VisibilityOutlined } from '../icons';

import type { InputCustomProps } from '../../core/types';
import type { TextFieldProps } from '@mui/material';

interface Props extends InputCustomProps {
  margin?: TextFieldProps['margin'];
}

/**
 * Common Input for Password.
 * Supports interactive action "Hold to see the password" on click and hold by endAdornment icon
 */
export const PasswordInput = (props: Props) => {
  const { label, errorMessage, helperText, name, onBlur, onChange, ref } = props;
  const { margin, autoFocus, fullWidth } = props;

  const { t } = useTranslation();
  const [passVisible, setPassVisible] = useState<boolean>(false);

  const handlePassVisible = () => setPassVisible(true);
  const handlePassHide = () => setPassVisible(false);
  const togglePassVisible = () => setPassVisible(!passVisible);

  const endAdornment = (
    <InputAdornment
      position='end'
      sx={{ cursor: 'pointer' }}
      title={t('common.holdToSeePass')}
      onMouseDown={handlePassVisible}
      onMouseUp={handlePassHide}
      onMouseLeave={handlePassHide}
      onTouchStart={togglePassVisible}
      children={passVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
    />
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
      autoComplete='off'
      type={passVisible ? 'text' : 'password'}
      autoFocus={autoFocus}
      onChange={onChange}
      onBlur={onBlur}
      slotProps={{ input: { endAdornment } }}
    />
  );
};
