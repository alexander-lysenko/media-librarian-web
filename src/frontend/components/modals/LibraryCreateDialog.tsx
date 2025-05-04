import { Box, Button, CircularProgress, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LibraryElementEnum } from "../../core/enums";
import { useFormValidation } from "../../hooks";
import { useLibraryCreateRequest } from "../../requests/libraryRequests";
import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";
import { AddCircleOutlined, DriveFileRenameOutlineOutlined, HourglassBottomOutlined, SaveAsOutlined } from "../icons";
import { LibraryFieldTemplate } from "../inputs/LibraryFieldTemplate";
import { TextInput } from "../inputs/TextInput";
import { FormDialog, type FormDialogProps } from "../ui/modals/FormDialog";

import type { LibraryFormData } from "../../core/types";
import type { MutateOptions } from "@tanstack/react-query";
import type { SyntheticEvent } from "react";
import type { SubmitHandler } from "react-hook-form";

/**
 * A dialog component for creating new libraries with customizable fields.
 * Provides a form interface where users can:
 * - Set the library title
 * - Add, remove, and configure multiple fields
 * - Specify field types (e.g., line, text, etc.)
 */
export const LibraryCreateDialog = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { open, setOpen, titleUniqueProcessing } = useLibraryCreateFormStore();

  const libraryCreateRequest = useLibraryCreateRequest();
  const loading = libraryCreateRequest.status === "pending";

  // HOOK FORM
  const useHookForm = useForm<LibraryFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { title: "", fields: [{ name: "", type: "line" }] },
  });
  const { registerField, registerFieldDebounced } = useFormValidation("libraryCreate", useHookForm);
  const { formState, setError, reset, handleSubmit, control, watch } = useHookForm;
  const { append, remove } = useFieldArray({ control, name: "fields" });
  const watchingFields = watch("fields");

  // EVENTS
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      event.preventDefault();
      return false;
    }

    reset();
    setOpen(false);
  };

  const handleAddNewField = () => append({ name: "", type: LibraryElementEnum.line }, { shouldFocus: true });

  const onValidSubmit: SubmitHandler<LibraryFormData> = async (data) => {
    const responseEffects: MutateOptions = {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: (reason) => {
        setError("root.serverError", { message: `${reason.code} ${reason.message}` });
      },
    };

    void libraryCreateRequest.mutateAsync({ data }, responseEffects as never);
  };

  const dialogProps: FormDialogProps = {
    open: open,
    paperSx: { minHeight: { sm: "calc(100% - 128px)" } },
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t("libraryCreate.title")}</FormDialog.Title>
      <FormDialog.Content dividers>
        <TextInput
          {...registerFieldDebounced(1000, "title")}
          label={t("libraryCreate.libraryTitle")}
          errorMessage={formState.errors.title?.message as string}
          margin="none"
          icon={titleUniqueProcessing ? <HourglassBottomOutlined /> : <DriveFileRenameOutlineOutlined />}
        />
        <Typography variant="subtitle1" children={t("libraryCreate.fieldsSet")} mt={1} />
        <Divider sx={{ mb: 0.5 }} />
        {watchingFields.map((_field, index) => {
          return (
            <LibraryFieldTemplate
              key={index}
              index={index}
              registerField={registerField}
              errors={formState.errors}
              onRemove={() => remove(index)}
            />
          );
        })}
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button
          variant="outlined"
          onClick={handleAddNewField}
          startIcon={<AddCircleOutlined />}
          children={fullScreen ? t("libraryCreate.field") : t("libraryCreate.addNewField")}
        />
        <Box flex="1 0 auto" />
        <Button variant="text" onClick={handleClose} children={t("common.cancel")} />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || titleUniqueProcessing}
          endIcon={loading || titleUniqueProcessing ? <CircularProgress size={14} /> : <SaveAsOutlined />}
          children={t("common.create")}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};
