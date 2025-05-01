import type { SyntheticEvent } from "react";
import type { MouseEventHandler, ReactNode } from "react";

/** Props for the SimpleDialog component that control and handle dialog behavior
 *
 * @property {boolean} open - Whether dialog is open/closed
 * @property {(event: SyntheticEvent | Event, reason?: string) => void} onClose - Called when dialog closes
 * @property {(event: SyntheticEvent | Event) => void} [onSubmit] - Optional submit handler
 */
export interface SimpleDialogProps {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
  onSubmit?: (event: SyntheticEvent | Event) => void;
}

/**
 * Properties for the ConfirmDialog component.
 *
 * @property {ReactNode} message
 * The content or message is displayed in the confirmation dialog.
 * @property {MouseEventHandler | () => void | Promise<void>} onConfirm
 * Callback executed when the user confirms the action.
 * @property {MouseEventHandler | () => void | Promise<void>} [onCancel]
 * Optional callback executed when the user cancels the action.
 * @property {string} [subjectItem]
 * Optional name or identifier of the item related to the confirmation dialog.
 * @property {"question" | "warning"} [type]
 * Optional dialog type indicating the context or nature of the dialog.
 */
export interface ConfirmDialogProps {
  message: ReactNode;
  onConfirm: MouseEventHandler | (() => void | Promise<void>);
  onCancel?: MouseEventHandler | (() => void | Promise<void>);
  subjectItem?: string;
  type?: "question" | "warning";
}
