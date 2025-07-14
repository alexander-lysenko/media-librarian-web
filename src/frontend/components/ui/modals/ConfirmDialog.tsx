import { Button, Chip, CircularProgress, Grow } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfirmDialogStore } from '../../../store/app/useConfirmDialogStore';
import { CloseOutlined, DoneOutlined, NavigateNextOutlined } from '../../icons';

import type { DialogProps } from '@mui/material';
import type { MouseEventHandler } from 'react';

/**
 * Confirmation Dialog - Global Component
 * Recommended to be placed into a higher or main component.
 * Only a single instance of the component is strongly required.
 * The confirmation dialog can be opened from any place of code
 *  using confirmDialog() imported from useConfirmDialogStore.
 * This dialog supports asynchronous events onConfirm and onCancel.
 *
 * @see confirmDialog
 * @see useConfirmDialogStore
 * @constructor
 */
export const ConfirmDialog = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const { open, setOpen, message, type, subjectItem, onConfirm, onCancel } = useConfirmDialogStore();

  const handleConfirm: MouseEventHandler = async (event) => {
    setLoading(true);
    await onConfirm?.(event);
    setLoading(false);
    setOpen(false);
    window.history.back();
  };

  const handleCancel: MouseEventHandler = async (event, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      event.preventDefault();
      return false;
    }
    await onCancel?.(event);
    setOpen(false);
    window.history.back();
  };

  useEffect(() => {
    const handlePreventPopstate = () => {
      open && window.history.pushState({}, '', window.location.href);
    };

    handlePreventPopstate();
    window.addEventListener('popstate', handlePreventPopstate);
    return () => {
      window.removeEventListener('popstate', handlePreventPopstate);
    };
  }, [open]);

  const dialogProps: DialogProps = {
    open,
    keepMounted: true,
    fullWidth: true,
    maxWidth: 'xs',
    disableRestoreFocus: true,
    closeAfterTransition: true,
    slots: { transition: Grow },
    slotProps: {
      transition: { timeout: 60 },
    },
    onClose: handleCancel,
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle variant={'h5'}>{t('confirm.title')}</DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <DialogContentText children={message} component='p' />
        {subjectItem && <Chip label={subjectItem} variant='outlined' icon={<NavigateNextOutlined />} />}
      </DialogContent>
      <DialogActions>
        <Button
          type='button'
          variant='outlined'
          startIcon={<CloseOutlined />}
          onClick={handleCancel}
          children={t('common.cancel')}
        />
        <Button
          type='submit'
          variant='contained'
          color={type === 'warning' ? 'warning' : 'error'}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={14} /> : <DoneOutlined />}
          onClick={handleConfirm}
          children={t('common.ok')}
        />
      </DialogActions>
    </Dialog>
  );
};
