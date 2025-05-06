import { useConfirmDialogStore } from '../store/app/useConfirmDialogStore';
import { useSnackbarStore } from '../store/system/useSnackbarStore';

import type { ConfirmDialogProps } from './types';

/**
 * A shortcut to push a snack notification from everywhere in the code
 */
export const enqueueSnack = useSnackbarStore.getState().enqueueSnack;

/**
 * A shortcut to open a confirmation dialog with the specified properties from anywhere in the application
 */
export const confirmDialog = (props: ConfirmDialogProps) => useConfirmDialogStore.setState({ ...props, open: true });
