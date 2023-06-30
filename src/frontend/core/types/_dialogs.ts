import { SyntheticEvent } from "react";

export type SimpleDialogProps = {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
  onSubmit?: (event: SyntheticEvent | Event) => void;
};
