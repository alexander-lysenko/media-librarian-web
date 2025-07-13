import { Box, Container, Divider, Drawer, IconButton, styled } from '@mui/material';
import { BottomNavigation, BottomNavigationAction, List, ListItem, ListItemText } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useLibraryItemActions } from '../../hooks';
import { usePreviewDrawerStore } from '../../store/app/usePreviewDrawerStore';
import { useLibraryTableStore } from '../../store/library/useLibraryTableStore';
import { CloseOutlined, DeleteOutlined, EditNoteOutlined } from '../icons';
import { PosterBox } from './PosterBox';
import { PrintDate } from './PrintDate';
import { PrintPriority } from './PrintPriority';
import { PrintRating } from './PrintRating';
import { PrintSwitch } from './PrintSwitch';

import type { LibraryElement } from '../../core/types';
import type { DrawerProps } from '@mui/material';
import type { MouseEventHandler, ReactElement } from 'react';

/**
 * A right-side drawer displaying the entire item selected from a Library
 */
export const LibraryDrawer = () => {
  const { t } = useTranslation();

  const { open, setOpen, selectedItemId, setSelectedItemId } = usePreviewDrawerStore();
  const columns = useLibraryTableStore((state) => state.columns);
  const item = useLibraryTableStore((state) => {
    return state.rows.find((dataRow) => dataRow.id === selectedItemId);
  });

  const { handleItemEdit, handleItemDelete } = useLibraryItemActions();

  const handleClose = useCallback(
    (event: KeyboardEvent | MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.type === 'keydown' && ['Tab', 'Shift'].includes((event as KeyboardEvent).key)) {
        return;
      }

      setOpen(false);
      setSelectedItemId(null);
    },
    [setOpen, setSelectedItemId],
  );

  useEffect(() => {
    const handleEscapeClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setSelectedItemId(null);
      }
    };
    window.addEventListener('keydown', handleEscapeClose);

    return () => window.removeEventListener('keydown', handleEscapeClose);
  }, [setOpen, setSelectedItemId]);

  const drawerProps: DrawerProps = {
    open,
    variant: 'persistent',
    anchor: 'right',
    hideBackdrop: true,
    // sx: { width: 0 },
    slotProps: {
      paper: { sx: { width: { xs: '100%', sm: 480, md: 480, xl: 480 } } },
    },
    onClose: handleClose,
  };

  return (
    <Drawer {...drawerProps}>
      <CloseButton onClose={handleClose as unknown as MouseEventHandler} />
      <Box sx={{ overflowY: 'auto' }}>
        <PosterBox
          title={item?.[columns[0].label] as string}
          src='https://source.unsplash.com/wMkaMXTJjlQ'
          height={360}
        />
        <Divider />
        <BottomNavigation showLabels sx={{ background: 'transparent' }}>
          <Action
            label={t('libraryItem.updateThisEntry')}
            icon={<EditNoteOutlined />}
            onClick={handleItemEdit}
            sx={{ color: (theme) => theme.palette.info[theme.palette.mode] }}
          />
          <Action
            label={t('libraryItem.deleteThisEntry')}
            icon={<DeleteOutlined />}
            onClick={handleItemDelete}
            sx={{ color: (theme) => theme.palette.error[theme.palette.mode] }}
          />
        </BottomNavigation>
        <Divider />
        <Container>
          <List dense disablePadding>
            {columns.slice(1).map((column) => (
              <ListItem key={column.label} disableGutters>
                <ListItemText
                  primary={column.label}
                  secondary={<ItemCellContents type={column.type} value={item?.[column.label] as never} />}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Box>
    </Drawer>
  );
};

const CloseButton = ({ onClose }: { onClose: MouseEventHandler }) => (
  <IconButton
    size='large'
    onClick={onClose}
    sx={{ position: 'absolute', right: 16, top: 8, color: (theme) => theme.palette.grey[200], zIndex: 1 }}
    children={<CloseOutlined />}
  />
);

const ItemCellContents = memo(({ type, value }: { type: LibraryElement; value: never }) => {
  switch (type) {
    case 'line':
    case 'text':
      return (value ?? '...') as ReactElement;
    case 'url':
      return value ? <a href={value} children={value} target='_blank' rel='noreferrer' /> : '...';
    case 'date':
    case 'datetime':
      return value ? <PrintDate format={type} value={value} /> : '...';
    case 'rating5':
    case 'rating5precision':
      return <PrintRating value={value ?? 0} size={5} />;
    case 'rating10':
    case 'rating10precision':
      return <PrintRating value={value ?? 0} size={10} />;
    case 'priority':
      return <PrintPriority value={(value ?? 0) as number} />;
    case 'checkmark':
      return <PrintSwitch asText value={value as boolean} />;
  }
});

const Action = styled(BottomNavigationAction)(({ theme }) => ({
  '&:hover': {
    background: theme.palette.action.hover,
  },
}));
