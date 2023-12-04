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
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { defaults } from "lodash-es";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useFormDefaultValues } from "../../hooks/useFormDefaultValues";
import {
  useLibraryItemGetRequest,
  useLibraryItemPostRequest,
  useLibraryItemPutRequest,
} from "../../requests/useLibraryItemRequests";
import { useLibraryListStore } from "../../store/library/useLibraryListStore";
import { useLibraryItemFormStore } from "../../store/useLibraryItemFormStore";
import { LibraryItemInputControl } from "../libraryItemInput/LibraryItemInputControl";

import type { LibraryItemResponse } from "../../core/types";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 * TODO: WIP
 * @constructor
 */
export const LibraryItemDialog = () => {
  const { t } = useTranslation();

  const selectedLibrary = useLibraryListStore((state) => state.getSelectedLibrary());
  const { isOpen, isEditMode, handleClose } = useLibraryItemFormStore();
  const selectedItemId = useLibraryItemFormStore((state) => state.selectedItemId);

  const [loading, setLoading] = useState<boolean>(false);
  const [libraryItem, setLibraryItem] = useState<LibraryItemResponse>();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const getLibraryItemRequest = useLibraryItemGetRequest();
  const createLibraryItemRequest = useLibraryItemPostRequest();
  const updateLibraryItemRequest = useLibraryItemPutRequest();

  const formDefaultValues = useFormDefaultValues(selectedLibrary?.fields);
  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    defaultValues: defaults(libraryItem?.item, formDefaultValues),
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
    handleClose();
  };

  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    console.log("Form is valid", data);
    setLoading(true);

    setTimeout(() => {
      // Submit request
      handleCloseWithReset(event as SyntheticEvent);
      // handleSubmitted(event as SyntheticEvent);
    }, 2000);
  };

  useLayoutEffect(() => {
    if (selectedLibrary && selectedItemId) {
      getLibraryItemRequest.fetch(undefined, { id: selectedLibrary.id, item: selectedItemId }).then((response) => {
        setLibraryItem(response as LibraryItemResponse);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId, selectedLibrary]);

  return (
    <Dialog open={isOpen} fullWidth fullScreen={fullScreen} TransitionComponent={Grow} transitionDuration={120}>
      <Form noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <DialogTitle variant="h5">
          {isEditMode ? t("libraryItem.title.edit") : t("libraryItem.title.create")}
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
                {...(index === 0 ? registerFieldDebounced(1000, label, "title") : registerField(label, type))}
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
            children={isEditMode ? t("common.update") : t("common.create")}
          />
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});
