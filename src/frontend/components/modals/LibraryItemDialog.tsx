import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
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

import { LibraryElementEnum } from "../../core/enums";
import { useFormValidation } from "../../hooks";
import { LibraryItemInput } from "../inputs";

type Props = {
  handleSubmitted: (event: SyntheticEvent | Event) => void;
  handleClose: (event: SyntheticEvent | Event, reason?: string) => void;
  open: boolean;
  isNewEntry?: boolean;
};

export const LibraryItemDialog = ({ open, isNewEntry = false, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    // defaultValues: {},
  });

  const { registerField, registerFieldDebounced } = useFormValidation("libraryItem", useHookForm);
  const { formState, reset, handleSubmit, control, watch } = useHookForm;
  const { errors } = formState;

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
        <DialogTitle variant="h5">
          {isNewEntry ? t("libraryItemDialog.title.create") : t("libraryItemDialog.title.edit")}
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 640, maxHeight: { sm: 640 } }}>
          {Object.entries(schema).map(([label, type], index) => {
            return (
              <LibraryItemInput
                key={label}
                type={type}
                label={label}
                control={control}
                errorMessage={errors?.[label]?.message as string}
                {...(index === 0 ? registerFieldDebounced(1000, label) : registerField(label))}
                // {...(index === 0 ? registerFieldDebounced(1000, label, "title") : registerField(label, "title"))}
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCloseWithReset} children={t("common.cancel")} />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={14} /> : <SaveAsOutlinedIcon />}
            children={isNewEntry ? t("common.create") : t("common.update")}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const schema: Record<string, keyof typeof LibraryElementEnum> = {
  // "Movie Title": "line",
  // "Origin Title": "line",
  // "Release Date": "date",
  // Description: "text",
  // "IMDB URL": "url",
  "IMDB Rating": "rating10",
  "My Rating": "rating5",
  Watched: "switch",
  // "Watched At": "datetime",
  // "Chance to Advice": "priority",
};
