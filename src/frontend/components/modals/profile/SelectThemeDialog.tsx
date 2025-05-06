import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

import { enqueueSnack } from '../../../core/actions';
import { useProfilePatchRequest } from '../../../requests/profileRequests';
import { useProfileDialogsStore } from '../../../store/app/useProfileDialogsStore';
import { useThemeStore } from '../../../store/system/useThemeStore';
import { ImageOutlined } from '../../icons';
import { SimpleDialog } from '../../ui/modals/SimpleDialog';

import type { PaletteMode } from '@mui/material';
import type { SyntheticEvent } from 'react';

/**
 * A Simple Dialog to change interface settings (theme) from the Profile section
 */
export const SelectThemeDialog = () => {
  const { t } = useTranslation();

  const { setMode: setThemeMode } = useThemeStore((state) => state);

  const open = useProfileDialogsStore((state) => state.themeDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setThemeDialogOpen);

  const profileUpdateRequest = useProfilePatchRequest();
  const loading = profileUpdateRequest.status === 'pending';

  const colors: Record<PaletteMode, { background: string; highlight: string }> = {
    light: {
      background: grey['200'],
      highlight: grey['900'],
    },
    dark: {
      background: grey['900'],
      highlight: grey['200'],
    },
  };

  const handleClose = (event: SyntheticEvent) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    setOpen(false);
  };

  const handleItemClick = (theme: PaletteMode) => {
    void profileUpdateRequest.mutateAsync(
      { theme },
      {
        onSuccess: (response) => {
          setThemeMode(response.user.theme as PaletteMode);
          enqueueSnack({ message: t('common.changesSaved'), type: 'success' });
        },
        onSettled: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <SimpleDialog open={open} onClose={handleClose}>
      <SimpleDialog.Title sx={{ pb: 0 }}>{t('dialogs.changeThemeDialog.title')}</SimpleDialog.Title>
      <List>
        {Object.entries(colors).map(([key, color]) => (
          <ListItemButton key={key} disabled={loading} onClick={() => handleItemClick(key as PaletteMode)}>
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: color.background, color: color.highlight }}>
                <ImageOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t(`theme.${key}`)} />
          </ListItemButton>
        ))}
      </List>
    </SimpleDialog>
  );
};
