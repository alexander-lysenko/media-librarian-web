import { FormControl, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { LibraryElementEnum } from '../../core/enums';
import { RemoveCircleOutlineOutlined } from '../icons';
import { TooltipWrapper } from '../ui/TooltipWrapper';
import { TextInput } from './TextInput';

import type { TextFieldProps } from '@mui/material';
import type { FieldErrors, FieldValues, UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  index: number;
  errors: FieldErrors;
  registerField: (fieldName: string, ruleName?: string) => UseFormRegisterReturn;
  onRemove: () => void;
}

export const LibraryFieldTemplate = ({ index, registerField, errors, onRemove }: Props) => {
  const { t } = useTranslation();
  const leading = index === 0;
  const tooltipTitle = leading ? t('libraryCreate.fieldCantBeRemoved') : t('libraryCreate.removeField');

  const customSelectProps: Partial<TextFieldProps> = {
    defaultValue: LibraryElementEnum.line,
    helperText: '',
    select: true,
    fullWidth: true,
    size: 'small',
    margin: 'dense',
  };

  return (
    <Grid container spacing={1} alignItems='stretch'>
      <Grid size={{ xs: 12, sm: 7 }}>
        <TextInput
          {...registerField(`fields.${index}.name`, 'name')}
          label={t('libraryCreate.fieldName')}
          errorMessage={(errors as FieldErrors<{ fields: FieldValues[] }>)?.fields?.[index]?.name?.message as string}
        />
      </Grid>
      <Grid size={{ xs: 10, sm: 4 }}>
        <TextField
          {...registerField(`fields.${index}.type`, 'type')}
          {...customSelectProps}
          label={t('libraryCreate.fieldType')}
          disabled={leading}
          children={Object.entries(LibraryElementEnum).map(([key, definition]) => (
            <MenuItem key={key} value={definition} children={t(`libraryTypes.${definition}`)} />
          ))}
        />
      </Grid>
      <Grid size={{ xs: 2, sm: 1 }} textAlign={'right'}>
        <FormControl size='small' margin='dense'>
          <TooltipWrapper title={tooltipTitle} placement='left' arrow wrap>
            <IconButton disabled={leading} onClick={onRemove}>
              <RemoveCircleOutlineOutlined />
            </IconButton>
          </TooltipWrapper>
        </FormControl>
      </Grid>
    </Grid>
  );
};
