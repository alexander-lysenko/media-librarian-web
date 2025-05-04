import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow } from "@mui/material";

import type {
  DialogActionsProps,
  DialogContentProps,
  DialogContentTextProps,
  DialogProps,
  DialogTitleProps,
} from "@mui/material";

const DialogWrapper = ({ open, children, onClose, ...props }: DialogProps) => {
  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    maxWidth: "xs",
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
  return (
    <DialogTitle {...props}>
      {children}
    </DialogTitle>
  );
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
