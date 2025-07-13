import { Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLibrariesStore, useSelectedLibraryStore } from '../../store/library/useLibrariesStore';
import { useLibraryCreateFormStore } from '../../store/useLibraryCreateFormStore';
import { ArrowDropDownOutlined, CollectionsOutlined, CreateNewFolderOutlined } from '../icons';

import type { MenuProps } from '@mui/material';
import type { MouseEvent } from 'react';

export const LibrarySelector = () => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const libraries = useLibrariesStore((state) => state.libraries);
  const selectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary());
  const setSelectedLibraryId = useSelectedLibraryStore((state) => state.setSelectedLibraryId);
  const openLibraryDialog = useLibraryCreateFormStore((state) => state.handleOpen);

  const handleItemClick = (_: MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(null);
    setSelectedLibraryId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreate = () => {
    setAnchorEl(null);
    openLibraryDialog();
  };

  const menuProps: MenuProps = {
    open: Boolean(anchorEl),
    onClose: handleClose,
    anchorEl,
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    sx: { mt: 0.1 },
    slotProps: {
      // list: { dense: true },
      paper: { style: { width: 320, maxHeight: 48 * 4.5 } },
    },
  };

  return (
    <Paper sx={{ alignSelf: 'center', width: '100%', maxWidth: 320 }}>
      <Grid container sx={{ pl: 2 }} onClick={(event) => setAnchorEl(event.currentTarget)}>
        <Grid size='grow' alignContent='center'>
          {/*<Typography variant="caption" noWrap sx={{ color: "text.secondary", lineHeight: 1 }}>*/}
          {/*  {"Now viewing library:"}*/}
          {/*</Typography>*/}
          <Typography variant='body1' noWrap>
            {selectedLibrary?.title}
          </Typography>
        </Grid>
        <Grid size='auto'>
          <IconButton children={<ArrowDropDownOutlined />} />
        </Grid>
      </Grid>

      <Menu {...menuProps}>
        {libraries.map((library) => {
          const selected = library.id === selectedLibrary?.id;
          const handleClick = (event: MouseEvent<HTMLElement>) => handleItemClick(event, library.id);

          return (
            <MenuItem key={library.id} selected={selected} onClick={handleClick}>
              <ListItemIcon>
                <CollectionsOutlined />
              </ListItemIcon>
              {library.title}
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem key={'new'} onClick={handleCreate}>
          <ListItemIcon>
            <CreateNewFolderOutlined />
          </ListItemIcon>
          {t('myLibraries.createLibrary')}
        </MenuItem>
      </Menu>
    </Paper>
  );
};
