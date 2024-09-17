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
import dayjs from "dayjs";
import { defaults, pick } from "lodash-es";
import type { KeyboardEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { FieldErrors, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useLibraryItemPostRequest, useLibraryItemPutRequest } from "../../requests/useLibraryItemRequests";
import { useSelectedLibraryStore } from "../../store/library/useLibrariesStore";
import { useLibraryItemFormStore } from "../../store/useLibraryItemFormStore";
import { AddCircleOutlined, ArrowDropDownOutlined, ArrowDropUpOutlined, SaveAsOutlined } from "../icons";
import { LibraryItemInputControl } from "../libraryItemInput/LibraryItemInputControl";

import type { LibraryElement, LibraryFields, LibraryItemFormValues, PostLibraryItemRequest } from "../../core/types";
import { PosterUploadInputBox } from "../ui/PosterUploadInputBox";

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 * TODO: WIP
 */
export const LibraryItemDialog = () => {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const selectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary());
  const { isOpen, isEditMode, selectedItem } = useLibraryItemFormStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPoster, setShowPoster] = useState<boolean>(false);
  const dialogContentHeight = showPoster ? 640 - 116 : 640;

  const useHookForm = useForm<LibraryItemFormValues>({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });

  const { registerField, registerFieldDebounced } = useFormValidation("libraryItem", useHookForm);
  const { formState, reset, handleSubmit, control } = useHookForm;
  const { errors } = formState;

  const { onValidSubmit, onInvalidSubmit, handleCloseWithReset, handleSubmitByCtrlEnter } = useDialogFormEvents(
    useHookForm,
    setLoading,
  );

  useEffect(() => {
    if (isOpen) {
      const formDefaultValues = initFormDefaultValues(selectedLibrary?.fields);
      const dataValues = pick(selectedItem, Object.keys(selectedLibrary?.fields ?? {}));
      const formValues = defaults(dataValues, formDefaultValues);
      reset(formValues, { keepDirtyValues: true });
    }
  }, [isOpen, reset, selectedItem, selectedLibrary]);

  return (
    <Dialog open={isOpen} fullWidth fullScreen={fullScreen} TransitionComponent={Grow} transitionDuration={120}>
      <Form noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} onKeyDown={handleSubmitByCtrlEnter}>
        <DialogTitle variant="h5">
          {isEditMode ? t("libraryItem.title.edit") : t("libraryItem.title.create")}
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: { sm: dialogContentHeight } }}>
          {Object.entries(selectedLibrary?.fields || {}).map(
            ([label, type]: [string, LibraryElement], index: number) => (
              <LibraryItemInputControl
                key={label}
                type={type}
                label={label}
                control={control}
                errorMessage={errors?.[label]?.message as string}
                {...(index === 0 // prettier ignore
                  ? registerFieldDebounced(1000, label, "title")
                  : registerField(label, type))}
              />
            ),
          )}
        </DialogContent>
        <DialogActions sx={{ display: showPoster ? "flex" : "none", py: 0 }}>
          <PosterUploadInputBox />
        </DialogActions>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setShowPoster(!showPoster)}
            startIcon={<AddCircleOutlined />}
            endIcon={showPoster ? <ArrowDropDownOutlined /> : <ArrowDropUpOutlined />}
            children={t("libraryItem.addPoster")}
          />
          <Box flex="1 0 auto" />
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

const initFormDefaultValues = (fields?: LibraryFields) => {
  const defaultValues: Record<LibraryElement, () => string | number | boolean> = {
    line: () => "",
    text: () => "",
    date: () => dayjs().format("YYYY-MM-DD"),
    datetime: () => dayjs().format("YYYY-MM-DD HH:mm:ss"),
    url: () => "",
    checkmark: () => false,
    rating5: () => 0,
    rating5precision: () => 0,
    rating10: () => 0,
    rating10precision: () => 0,
    priority: () => 0,
  };

  const reducer = (acc: LibraryItemFormValues, [column, type]: [string, LibraryElement]) => {
    acc[column] = defaultValues[type]();

    return acc;
  };

  return Object.entries(fields || {}).reduce(reducer, {});
};

const useDialogFormEvents = (
  formHook: UseFormReturn<LibraryItemFormValues>,
  setLoading: (loading: boolean) => void,
) => {
  const { reset, handleSubmit } = formHook;
  const { isEditMode, handleClose, selectedLibraryId, selectedItem } = useLibraryItemFormStore();

  const createLibraryItemRequest = useLibraryItemPostRequest();
  const updateLibraryItemRequest = useLibraryItemPutRequest();

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      event.preventDefault();
      return false;
    }

    reset();
    setLoading(false);
    handleClose();
  };

  const onValidSubmit: SubmitHandler<LibraryItemFormValues> = (data, event) => {
    setLoading(true);
    // console.log("Form is valid", data);
    const request: PostLibraryItemRequest = {
      contents: data,
      // poster: poster ?? "",
    };

    if (isEditMode) {
      updateLibraryItemRequest
        .fetch(request, { id: selectedLibraryId as number, item: selectedItem?.id as number })
        .then(() => handleCloseWithReset(event as SyntheticEvent));
    } else {
      createLibraryItemRequest
        .fetch(request, { id: selectedLibraryId as number })
        .then(() => handleCloseWithReset(event as SyntheticEvent));
    }
  };

  const onInvalidSubmit: SubmitErrorHandler<LibraryItemFormValues> = (data: FieldErrors) => {
    console.log("Errors", data);
  };

  const handleSubmitByCtrlEnter = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (e.code === "Enter" && !["TEXTAREA"].includes(target.tagName)) {
      e.preventDefault();
    }
    if (e.code === "Enter" && e.ctrlKey) {
      handleSubmit(onValidSubmit, onInvalidSubmit)();
    }
  };

  return { onValidSubmit, onInvalidSubmit, handleCloseWithReset, handleSubmitByCtrlEnter };
};
