import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  type DialogContentTextProps,
  DialogTitle,
  Grow,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import type { DialogActionsProps, DialogContentProps, DialogProps, DialogTitleProps, ModalProps } from "@mui/material";
import type { SxProps } from "@mui/system";
import type { FormEventHandler, KeyboardEventHandler } from "react";

export interface FormDialogProps extends DialogProps {
  onSubmit: FormEventHandler<HTMLDivElement>;
  onClose?: ModalProps["onClose"];
  paperSx?: SxProps;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}

const DialogWrapper = ({ children, onClose, onSubmit, onKeyDown, paperSx, ...props }: FormDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const dialogProps: DialogProps = {
    fullScreen: props.fullScreen ?? fullScreen,
    fullWidth: true,
    scroll: "paper",
    disableRestoreFocus: true,
    closeAfterTransition: true,
    slots: { transition: Grow },
    slotProps: {
      transition: { timeout: 120 },
      paper: {
        component: "form",
        sx: paperSx,
        onSubmit: onSubmit,
        onKeyDown: onKeyDown,
      },
    },
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
    <DialogTitle variant="h5" {...props}>
      {children}
    </DialogTitle>
  );
};

const _Subtitle = ({ children, ...props }: DialogContentTextProps) => {
  return (
    <DialogContentText sx={{ pb: 1 }} {...props}>
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

export const FormDialog = Object.assign(DialogWrapper, {
  Title: _Title,
  Subtitle: _Subtitle,
  Content: _Content,
  Actions: _Actions,
});
