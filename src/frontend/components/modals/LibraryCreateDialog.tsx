import {
  AddCircleOutlined,
  DriveFileRenameOutlineOutlined,
  HourglassBottomOutlined,
  RemoveCircleOutlineOutlined,
  SaveAsOutlined,
} from "@mui/icons-material";
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
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LibraryElementEnum } from "../../core/enums";
import { useFormValidation } from "../../hooks";
import { useLibrariesGetRequest, useLibraryCreateRequest } from "../../requests/useLibraryRequests";
import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";
import { TextInput } from "../inputs/TextInput";
import { TooltipWrapper } from "../ui/TooltipWrapper";

import type { CreateLibraryRequest } from "../../core/types";
import type { TextFieldProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type {
  FieldErrors,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormRegisterReturn,
} from "react-hook-form";

type InlineTemplateProps = {
  index: number;
  errors: FieldErrors;
  registerField: (fieldName: string, ruleName?: string) => UseFormRegisterReturn;
  onRemove: () => void;
};

/**
 * Modal dialog containing the form to create a Library
 * @constructor
 */
export const LibraryCreateDialog = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState<boolean>(false);
  const { open, setOpen, titleUniqueProcessing } = useLibraryCreateFormStore();

  // HOOK FORM
  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    defaultValues: { title: "", fields: [{ name: "", type: "line" }] },
  });
  const { registerField, registerFieldDebounced } = useFormValidation("libraryCreate", useHookForm);
  const { formState, setError, reset, handleSubmit, control, watch } = useHookForm;
  const { append, remove } = useFieldArray({ control, name: "fields" });
  const watchingFields = watch("fields");

  // REQUEST
  const { fetch: submit } = useLibraryCreateRequest({ reset, setLoading, setOpen, setError });
  const { fetch: getLibraries } = useLibrariesGetRequest();

  // EVENTS
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      event.preventDefault();
      return false;
    }

    reset();
    setLoading(false);
    setOpen(false);
  };

  const handleAddNewField = () => append({ name: "", type: LibraryElementEnum.line }, { shouldFocus: true });
  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
  const onValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await submit(data as CreateLibraryRequest).then(() => getLibraries());
  };

  return (
    <Dialog open={open} fullWidth fullScreen={fullScreen} TransitionComponent={Grow} transitionDuration={120}>
      <StyledFormBox noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <DialogTitle variant={"h5"}>{t("libraryCreate.title")}</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 640, maxHeight: { sm: 640 } }}>
          <TextInput
            {...registerFieldDebounced(1000, "title")}
            label={t("libraryCreate.libraryTitle")}
            errorMessage={formState.errors.title?.message as string}
            margin="none"
            icon={titleUniqueProcessing ? <HourglassBottomOutlined /> : <DriveFileRenameOutlineOutlined />}
          />
          <Typography variant="subtitle1" children={t("libraryCreate.fieldsSet")} mt={1} />
          <Divider sx={{ mb: 0.5 }} />
          {watchingFields.map((field, index) => {
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
      </StyledFormBox>
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
      <Grid item xs={12} sm={7}>
        <TextInput
          {...registerField(`fields.${index}.name`, "name")}
          label={t("libraryCreate.fieldName")}
          errorMessage={(errors as FieldErrors<{ fields: FieldValues[] }>)?.fields?.[index]?.name?.message as string}
        />
      </Grid>
      <Grid item xs={10} sm={4}>
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
      <Grid item xs={2} sm={1} textAlign={"right"}>
        <FormControl size="small" margin="dense">
          <TooltipWrapper title={tooltipTitle} placement="left" arrow wrap>
            <IconButton aria-label="delete" disabled={leading} onClick={onRemove}>
              <RemoveCircleOutlineOutlined />
            </IconButton>
          </TooltipWrapper>
        </FormControl>
      </Grid>
    </Grid>
  );
};

const StyledFormBox = styled("form")({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});
