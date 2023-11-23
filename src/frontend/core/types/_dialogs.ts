import type { SyntheticEvent } from "react";
import type { MouseEventHandler, ReactNode } from "react";

export type SimpleDialogProps = {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
  onSubmit?: (event: SyntheticEvent | Event) => void;
};

export type ConfirmDialogProps = {
  message: ReactNode;
  onConfirm: MouseEventHandler | VoidFunction | undefined;
  onCancel?: MouseEventHandler | VoidFunction;
  subjectItem?: string;
  type?: "question" | "warning";
};
