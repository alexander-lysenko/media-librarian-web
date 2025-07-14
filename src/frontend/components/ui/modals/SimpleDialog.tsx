import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow } from '@mui/material';

import { useCloseOnPopState } from '../../../hooks/useCloseOnPopState';

import type { DialogActionsProps, DialogContentProps, DialogContentTextProps, DialogTitleProps } from '@mui/material';
import type { DialogProps } from '@mui/material';
import type { SyntheticEvent } from 'react';

export interface SimpleDialogProps extends DialogProps {
  id: string;
  onClose: (event: SyntheticEvent, reason?: string) => void;
}

const DialogWrapper = ({ open, children, onClose, ...props }: SimpleDialogProps) => {
  useCloseOnPopState({ id: props.id, open, onClose: onClose as never });

  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    maxWidth: 'xs',
    disableRestoreFocus: true,
    slots: { transition: Grow },
    slotProps: { transition: { timeout: 120 } },
    ...props,
  };

  return (
    <Dialog {...dialogProps} onClose={onClose}>
      {children}
    </Dialog>
  );
};

const _Title = ({ children, ...props }: DialogTitleProps) => {
  return <DialogTitle {...props}>{children}</DialogTitle>;
};

const _Subtitle = ({ children, ...props }: DialogContentTextProps) => {
  return (
    <DialogContentText sx={{ pb: 0 }} {...props}>
      {children}
    </DialogContentText>
  );
};

const _Content = ({ children, ...props }: DialogContentProps) => {
  return <DialogContent {...props}>{children}</DialogContent>;
};

const _Actions = ({ children, ...props }: DialogActionsProps) => {
  return <DialogActions {...props}>{children}</DialogActions>;
};

export const SimpleDialog = Object.assign(DialogWrapper, {
  Title: _Title,
  Subtitle: _Subtitle,
  Content: _Content,
  Actions: _Actions,
});
