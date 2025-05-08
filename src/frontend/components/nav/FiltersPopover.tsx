import { Box, IconButton, Popover, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SearchOutlined } from '../icons';

import type { MouseEvent } from 'react';

export const FiltersPopover = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  return (
    <>
      <Tooltip arrow title={t('app.openFiltersMenu')}>
        <IconButton size='large' color='inherit' sx={{ ml: 1 }} onClick={handleOpen}>
          <SearchOutlined></SearchOutlined>
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        onClose={handleOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: { xs: 0.5, sm: 1 } }}
        keepMounted
      >
        <Box sx={{ width: { xs: 'calc(100vw - 32px)', sm: 360 }, p: 2 }}>{'filters form'}</Box>
      </Popover>
    </>
  );
};
