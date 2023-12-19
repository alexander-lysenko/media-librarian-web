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
import { defaults } from "lodash-es";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../core/actions";
import { useFormValidation } from "../../hooks";
import { useFormDefaultValues } from "../../hooks/useFormDefaultValues";
import { useLibraryItemPostRequest, useLibraryItemPutRequest } from "../../requests/useLibraryItemRequests";
import { useLibraryListStore } from "../../store/library/useLibraryListStore";
import { useLibraryItemFormStore } from "../../store/useLibraryItemFormStore";
import { LibraryItemInputControl } from "../libraryItemInput/LibraryItemInputControl";

import type { LibraryElement, LibraryItemFormValues, PostLibraryItemRequest } from "../../core/types";
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
  const { isOpen, isEditMode, handleClose, selectedLibraryId, selectedItem } = useLibraryItemFormStore();
  const { poster, setPoster } = useLibraryItemFormStore();

  const [loading, setLoading] = useState<boolean>(false);
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const createLibraryItemRequest = useLibraryItemPostRequest();
  const updateLibraryItemRequest = useLibraryItemPutRequest();

  const formDefaultValues = useFormDefaultValues(selectedLibrary?.fields);
  const formValues: LibraryItemFormValues = defaults(formDefaultValues, selectedItem);
  const useHookForm = useForm<LibraryItemFormValues>({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    defaultValues: formValues,
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

  // useEffect(() => {
  //   reset(formValues);
  // }, [formValues, reset]);

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
