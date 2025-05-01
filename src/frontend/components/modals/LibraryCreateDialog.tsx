import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  Grow,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LibraryElementEnum } from "../../core/enums";
import { useFormValidation } from "../../hooks";
import { useLibraryCreateRequest } from "../../requests/libraryRequests";
import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";
import {
  AddCircleOutlined,
  DriveFileRenameOutlineOutlined,
  HourglassBottomOutlined,
  RemoveCircleOutlineOutlined,
  SaveAsOutlined,
} from "../icons";
import { TextInput } from "../inputs/TextInput";
import { TooltipWrapper } from "../ui/TooltipWrapper";

import type { LibraryFormData } from "../../core/types";
import type { DialogProps, TextFieldProps } from "@mui/material";
import type { MutateOptions } from "@tanstack/react-query";
import type { SyntheticEvent } from "react";
import type { FieldErrors, FieldValues, SubmitHandler, UseFormRegisterReturn } from "react-hook-form";

interface InlineTemplateProps {
  index: number;
  errors: FieldErrors;
  registerField: (fieldName: string, ruleName?: string) => UseFormRegisterReturn;
  onRemove: () => void;
}

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

  const dialogProps: DialogProps = {
    open: open,
    fullScreen: fullScreen,
    fullWidth: true,
    scroll: "paper",
    disableRestoreFocus: true,
    closeAfterTransition: true,
    slots: { transition: Grow },
    slotProps: {
      transition: { timeout: 120 },
      paper: {
        component: "form",
        sx: { minHeight: { sm: "calc(100% - 128px)" } },
        onSubmit: handleSubmit(onValidSubmit),
      },
    },
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle variant={"h5"}>{t("libraryCreate.title")}</DialogTitle>
      <DialogContent dividers>
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
            <InputLineTemplate
              key={index}
              index={index}
              registerField={registerField}
              errors={formState.errors}
              onRemove={() => remove(index)}
            />
          );
        })}
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
};

const InputLineTemplate = ({ index, registerField, errors, onRemove }: InlineTemplateProps) => {
  const { t } = useTranslation();
  const leading = index === 0;
  const tooltipTitle = leading ? t("libraryCreate.fieldCantBeRemoved") : t("libraryCreate.removeField");

  const customSelectProps: Partial<TextFieldProps> = {
    defaultValue: LibraryElementEnum.line,
    helperText: "",
    select: true,
    fullWidth: true,
    size: "small",
    margin: "dense",
  };

  return (
    <Grid container spacing={1} alignItems="stretch">
      <Grid size={{ xs: 12, sm: 7 }}>
        <TextInput
          {...registerField(`fields.${index}.name`, "name")}
          label={t("libraryCreate.fieldName")}
          errorMessage={(errors as FieldErrors<{ fields: FieldValues[] }>)?.fields?.[index]?.name?.message as string}
        />
      </Grid>
      <Grid size={{ xs: 10, sm: 4 }}>
        <TextField
          {...registerField(`fields.${index}.type`, "type")}
          {...customSelectProps}
          label={t("libraryCreate.fieldType")}
          disabled={leading}
          children={Object.entries(LibraryElementEnum).map(([key, definition]) => (
            <MenuItem key={key} value={definition} children={t(`libraryTypes.${definition}`)} />
          ))}
        />
      </Grid>
      <Grid size={{ xs: 2, sm: 1 }} textAlign={"right"}>
        <FormControl size="small" margin="dense">
          <TooltipWrapper title={tooltipTitle} placement="left" arrow wrap>
            <IconButton disabled={leading} onClick={onRemove}>
              <RemoveCircleOutlineOutlined />
            </IconButton>
          </TooltipWrapper>
        </FormControl>
      </Grid>
    </Grid>
  );
};
