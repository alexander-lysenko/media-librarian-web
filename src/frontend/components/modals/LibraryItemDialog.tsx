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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useFormDefaultValues } from "../../hooks/useFormDefaultValues";
import { useLibraryListStore } from "../../store/useLibraryListStore";
import { BasicLibraryItemInput } from "../libraryItemInput/BasicLibraryItemInput";

import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

type Props = {
  handleSubmitted: (event: SyntheticEvent | Event) => void;
  handleClose: (event: SyntheticEvent | Event, reason?: string) => void;
  open: boolean;
  isNewEntry?: boolean;
};

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 * TODO: WIP
 * @param {boolean} open
 * @param {boolean} isNewEntry
 * @param {SyntheticEvent} handleClose
 * @param {SyntheticEvent} handleSubmitted
 * @constructor
 */
export const LibraryItemDialog = ({ open, isNewEntry = false, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const [selectedLibrary, fields] = useLibraryListStore((state) => [
    state.getSelectedLibraryId(),
    state.getSelectedLibrary()?.fields,
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const formDefaultValues = useFormDefaultValues(fields);
  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    defaultValues: defaultValues || formDefaultValues,
  });

  const { registerField, registerFieldDebounced } = useFormValidation("libraryItem", useHookForm);
  const { formState, reset, handleSubmit, control } = useHookForm;
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
          {isNewEntry ? t("libraryItem.title.create") : t("libraryItem.title.edit")}
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 640, maxHeight: { sm: 640 } }}>
          {Object.entries(fields || {}).map(([label, type], index) => {
            return (
              <BasicLibraryItemInput
                key={label}
                type={type}
                label={label}
                control={control}
                errorMessage={errors?.[label]?.message as string}
                {...(index === 0 ? registerFieldDebounced(1000, label, "titleREMOVE") : registerField(label, type))}
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
            endIcon={loading ? <CircularProgress size={14} /> : <SaveAsOutlined />}
            children={isNewEntry ? t("common.create") : t("common.update")}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const defaultValues: Record<string, string | number | boolean> = {
  "Movie Title": "Лицо со шрамом",
  "Origin Title": "Scarface",
  "Release Date": "1983-12-01",
  Description: "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.",
  "IMDB URL": "https://www.imdb.com/title/tt0086250/",
  "IMDB Rating": 8,
  "My Rating": 5,
  Watched: true,
  "Watched At": "2020-01-31 00:00:01",
  "Chance to Advice": 5,
};
