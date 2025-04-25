import type { SyntheticEvent } from "react";
import type { MouseEventHandler, ReactNode } from "react";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
  onSubmit?: (event: SyntheticEvent | Event) => void;
}

export interface ConfirmDialogProps {
  message: ReactNode;
  onConfirm: MouseEventHandler | VoidFunction | undefined;
  onCancel?: MouseEventHandler | VoidFunction;
  subjectItem?: string;
  type?: "question" | "warning";
}
