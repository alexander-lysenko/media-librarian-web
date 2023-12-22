import { SaveAsOutlined } from "@mui/icons-material";
import {
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
import { defaults } from "lodash-es";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useLibraryItemPostRequest, useLibraryItemPutRequest } from "../../requests/useLibraryItemRequests";
import { useLibraryListStore } from "../../store/library/useLibraryListStore";
import { useLibraryItemFormStore } from "../../store/useLibraryItemFormStore";
import { LibraryItemInputControl } from "../libraryItemInput/LibraryItemInputControl";

import type { LibraryElement, LibraryFields, LibraryItemFormValues, PostLibraryItemRequest } from "../../core/types";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 * TODO: WIP
 * @constructor
 */
export const LibraryItemDialog = () => {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const selectedLibrary = useLibraryListStore((state) => state.getSelectedLibrary());
  const { isOpen, isEditMode, handleClose, selectedLibraryId, selectedItem } = useLibraryItemFormStore();
  const { poster, setPoster } = useLibraryItemFormStore();

  const [loading, setLoading] = useState<boolean>(false);

  const createLibraryItemRequest = useLibraryItemPostRequest();
  const updateLibraryItemRequest = useLibraryItemPutRequest();

  const useHookForm = useForm<LibraryItemFormValues>({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
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
    setLoading(true);
    console.log("Form is valid", data);
    const request: PostLibraryItemRequest = {
      contents: data,
      poster: poster ?? "",
    };

    if (isEditMode) {
      updateLibraryItemRequest
        .fetch(request, { id: selectedLibraryId as number, itemId: selectedItem?.id as number })
        .then(() => handleCloseWithReset(event as SyntheticEvent));
    } else {
      createLibraryItemRequest
        .fetch(request, { id: selectedLibraryId as number })
        .then(() => handleCloseWithReset(event as SyntheticEvent));
    }
  };

  useEffect(() => {
    if (isOpen) {
      const formDefaultValues = initFormDefaultValues(selectedLibrary?.fields);
      const values = defaults(formDefaultValues, selectedItem);
      reset(values);
    }
  }, [isOpen, reset, selectedItem, selectedLibrary]);

  return (
    <Dialog open={isOpen} fullWidth fullScreen={fullScreen} TransitionComponent={Grow} transitionDuration={120}>
      <Form noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <DialogTitle variant="h5">
          {isEditMode ? t("libraryItem.title.edit") : t("libraryItem.title.create")}
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 640, maxHeight: { sm: 640 } }}>
          {Object.entries(selectedLibrary?.fields || {}).map(
            ([label, type]: [string, LibraryElement], index: number) => (
              <LibraryItemInputControl
                key={label}
                type={type}
                label={label}
                control={control}
                errorMessage={errors?.[label]?.message as string}
                {...(index === 0 ? registerFieldDebounced(1000, label, "title") : registerField(label, type))}
              />
            ),
          )}
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
