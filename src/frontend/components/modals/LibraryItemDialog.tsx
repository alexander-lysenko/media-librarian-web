import { SaveAsOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { TextInputMultiLine } from "../inputs/TextInputMultiLine";
import { TextInputSingleLine } from "../inputs/TextInputSingleLine";
import { CheckBoxedInput } from "../inputs/CheckBoxedInput";

type Props = {
  handleSubmitted: (event: React.SyntheticEvent | Event) => void;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  open: boolean;
  isNewEntry?: boolean;
};

export const LibraryItemDialog = ({ open, isNewEntry = false, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    defaultValues: { title: "", fields: [{ name: "", type: "line" }] },
  });
  const { formState, reset, handleSubmit, control, watch } = useHookForm;
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      event.preventDefault();
      return false;
    }

    reset();
    setLoading(false);
    handleClose(event, reason);
  };

  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    console.log("Form is valid", data);
    setLoading(true);

    setTimeout(() => {
      // Submit request
      handleCloseWithReset(event as SyntheticEvent);
      handleSubmitted(event as SyntheticEvent);
    }, 2000);
  };

  return (
    <Dialog open={open} fullWidth fullScreen={fullScreen} TransitionComponent={Grow} transitionDuration={120}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <DialogTitle variant={"h5"}>
          {isNewEntry ? t("libraryItemDialog.title.create") : t("libraryItemDialog.title.edit")}
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 640, maxHeight: { sm: 640 } }}>
          {/* Inputs start from here*/}
          <TextInputSingleLine name={"name"} label={"Имя"} />
          <TextInputMultiLine name={"noname"} label={"Фамилия"} />
          <CheckBoxedInput name={"check"} label={"Да или нет"} helperText={"наверное да"} />
          {/* Inputs end from here*/}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCloseWithReset} children={t("common.cancel")} />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={14} /> : <SaveAsOutlined />}
            children={isNewEntry ? t("common.create") : t("common.update")}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};
