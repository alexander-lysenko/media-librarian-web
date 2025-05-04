import { Box, Button, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { defaults, pick } from "lodash-es";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useLibraryItemPostRequest, useLibraryItemPutRequest } from "../../requests/libraryItemRequests";
import { useSelectedLibraryStore } from "../../store/library/useLibrariesStore";
import { useLibraryItemFormStore } from "../../store/useLibraryItemFormStore";
import { AddCircleOutlined, ArrowDropDownOutlined, ArrowDropUpOutlined, SaveAsOutlined } from "../icons";
import { LibraryItemInputControl } from "../libraryItemInput/LibraryItemInputControl";
import { FormDialog } from "../ui/modals/FormDialog";
import { PosterUploadInputBox } from "../ui/PosterUploadInputBox";

import type { LibraryElement, LibraryFields, LibraryItemFormData, LibraryItemFormValues } from "../../core/types";
import type { FormDialogProps } from "../ui/modals/FormDialog";
import type { MutateOptions } from "@tanstack/react-query";
import type { KeyboardEvent, SyntheticEvent } from "react";
import type { FieldErrors, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form";

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 */
export const LibraryItemDialog = () => {
  const { t } = useTranslation();

  const selectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary());
  const { open, isEditMode, selectedItem, titleUniqueProcessing } = useLibraryItemFormStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPoster, setShowPoster] = useState<boolean>(false);

  const useHookForm = useForm<LibraryItemFormValues>({ mode: "onBlur", reValidateMode: "onChange" });
  const { registerField, registerFieldDebounced } = useFormValidation("libraryItem", useHookForm);
  const { formState, reset, handleSubmit, control } = useHookForm;
  const { errors } = formState;

  const formEvents = useDialogFormEvents(useHookForm, setLoading, setShowPoster);

  useEffect(() => {
    if (open) {
      const formDefaultValues = initFormDefaultValues(selectedLibrary?.fields);
      const dataValues = pick(selectedItem, Object.keys(selectedLibrary?.fields ?? {}));
      const formValues = defaults(dataValues, formDefaultValues);
      reset(formValues, { keepDirtyValues: true });
    }
  }, [open, reset, selectedItem, selectedLibrary]);

  const dialogProps: FormDialogProps = {
    open: open,
    paperSx: { minHeight: { sm: "calc(100% - 128px)" } },
    onSubmit: handleSubmit(formEvents.onValidSubmit, formEvents.onInvalidSubmit),
    onKeyDown: formEvents.handleSubmitByCtrlEnter,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title noWrap>
        {isEditMode ? t("libraryItem.title.edit") : t("libraryItem.title.create")}
      </FormDialog.Title>
      <FormDialog.Content dividers>
        {Object.entries(selectedLibrary?.fields || {}).map(([label, type]: [string, LibraryElement], index: number) => (
          <LibraryItemInputControl
            key={label}
            type={type as LibraryElement}
            label={label}
            control={control}
            errorMessage={errors?.[label]?.message as string}
            loadingState={index === 0 ? titleUniqueProcessing : false}
            {...(index === 0 // prettier ignore
              ? registerFieldDebounced(1000, label, "title")
              : registerField(label, type))}
          />
        ))}
      </FormDialog.Content>
      <FormDialog.Actions sx={{ display: showPoster ? "flex" : "none", pb: 0 }}>
        <PosterUploadInputBox />
      </FormDialog.Actions>
      <FormDialog.Actions>
        <Button
          variant="outlined"
          onClick={() => setShowPoster(!showPoster)}
          startIcon={<AddCircleOutlined />}
          endIcon={showPoster ? <ArrowDropDownOutlined /> : <ArrowDropUpOutlined />}
          children={t("libraryItem.addPoster")}
        />
        <Box flex="1 0 auto" />
        <Button variant="text" onClick={formEvents.handleCloseWithReset} children={t("common.cancel")} />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={14} /> : <SaveAsOutlined />}
          children={isEditMode ? t("common.update") : t("common.create")}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};

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
  setShowPoster: (state: boolean) => void,
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
    setShowPoster(false);
    handleClose();
  };

  const onValidSubmit: SubmitHandler<LibraryItemFormValues> = (data, event) => {
    setLoading(true);

    const id = selectedLibraryId as number;
    const item = selectedItem?.id as number;
    const requestData: LibraryItemFormData = {
      contents: data,
      // poster: poster ?? "",
    };

    const responseEffects: MutateOptions = {
      onSuccess: () => handleCloseWithReset(event as SyntheticEvent),
      onSettled: () => setLoading(false),
    };

    if (isEditMode) {
      void updateLibraryItemRequest.mutateAsync({ id, item, data: requestData }, responseEffects as never);
    } else {
      void createLibraryItemRequest.mutateAsync({ id, data: requestData }, responseEffects as never);
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
