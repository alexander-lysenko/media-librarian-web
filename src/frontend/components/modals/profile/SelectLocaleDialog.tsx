import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { enqueueSnack } from '../../../core/actions';
import { useProfilePatchRequest } from '../../../requests/profileRequests';
import { useProfileDialogsStore } from '../../../store/app/useProfileDialogsStore';
import { useLanguageStore, useTranslationStore } from '../../../store/system/useTranslationStore';
import { SimpleDialog } from '../../ui/modals/SimpleDialog';

import type { Language } from '../../../store/system/useTranslationStore';
import type { SyntheticEvent } from 'react';

/**
 * A Simple Dialog to change locale settings (language) from the Profile section
 */
export const SelectLocaleDialog = () => {
  const { t } = useTranslation();

  const languages = useTranslationStore((state) => state.languages);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const open = useProfileDialogsStore((state) => state.localeDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setLocaleDialogOpen);

  const profileUpdateRequest = useProfilePatchRequest();
  const loading = profileUpdateRequest.status === 'pending';

  const handleClose = (event: SyntheticEvent) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    setOpen(false);
  };

  const handleItemClick = (event: SyntheticEvent, locale: Language) => {
    void profileUpdateRequest.mutateAsync(
      { locale },
      {
        onSuccess: (response) => {
          setLanguage(response.user.locale);
          enqueueSnack({ message: t('common.changesSaved'), type: 'success' });
        },
        onError: (reason) => {
          enqueueSnack({ message: reason.message, type: 'error' });
        },
        onSettled: () => {
          handleClose(event);
        },
      },
    );
  };

  return (
    <SimpleDialog id='select-locale' open={open} onClose={handleClose}>
      <SimpleDialog.Title sx={{ pb: 0 }}>{t('dialogs.changeLocaleDialog.title')}</SimpleDialog.Title>
      <List>
        {Object.entries(languages).map(([key, label]) => (
          <ListItemButton key={key} disabled={loading} onClick={(e) => handleItemClick(e, key as Language)}>
            <ListItemAvatar>
              <Avatar>{key}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <SimpleDialog.Content sx={{ pt: 1 }}>
        <Typography variant='body2'>{'More languages coming soon'}</Typography>
      </SimpleDialog.Content>
    </SimpleDialog>
  );
};
