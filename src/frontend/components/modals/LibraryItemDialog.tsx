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
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useFormDefaultValues } from "../../hooks/useFormDefaultValues";
import { useLibraryListStore } from "../../store/useLibraryListStore";
import { LibraryItemInputControl } from "../libraryItemInput/LibraryItemInputControl";

import type { LibraryItemFormValues, LibrarySchema } from "../../core/types";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

type Props = {
  open: boolean;
  selectedItemId: number | null;
  handleSubmitted: (event: SyntheticEvent | Event) => void;
  handleClose: (event: SyntheticEvent | Event, reason?: string) => void;
};

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 * TODO: WIP
 * @constructor
 */
export const LibraryItemDialog = ({ open, selectedItemId, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const selectedLibrary = useLibraryListStore((state) => state.getSelectedLibrary());
  const [loading, setLoading] = useState<boolean>(false);

  const formDefaultValues = useFormDefaultValues(selectedLibrary?.fields);
  const itemValues = useSelectedItemValues(selectedLibrary, selectedItemId);
  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    defaultValues: itemValues,
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

  useLayoutEffect(() => {}, []);

  return (
    <Dialog open={open} fullWidth fullScreen={fullScreen} TransitionComponent={Grow} transitionDuration={120}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <DialogTitle variant="h5">
          {selectedItemId ? t("libraryItem.title.edit") : t("libraryItem.title.create")}
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 640, maxHeight: { sm: 640 } }}>
          {Object.entries(selectedLibrary?.fields || {}).map(([label, type], index) => {
            return (
              <LibraryItemInputControl
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
            children={selectedItemId ? t("common.update") : t("common.create")}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const useSelectedItemValues = (
  selectedLibrary: LibrarySchema | undefined,
  itemId: number | null,
): LibraryItemFormValues => {
  const formDefaultValues = useFormDefaultValues(selectedLibrary?.fields);

  if (!selectedLibrary || !itemId) {
    return formDefaultValues;
  }

  return formDefaultValues;
};
