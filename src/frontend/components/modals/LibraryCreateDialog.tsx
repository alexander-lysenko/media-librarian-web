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
  InputAdornment,
  MenuItem,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { forwardRef, SyntheticEvent, useState } from "react";
import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import { useTranslation } from "react-i18next";

import { LibraryElementEnum } from "../../core/enums";
import { InputCustomProps } from "../../core/types";
import { useFormValidation } from "../../hooks";
import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";

type Props = {
  handleSubmitted: (event: SyntheticEvent | Event) => void;
  handleClose: (event: SyntheticEvent | Event, reason?: string) => void;
  open: boolean;
};

type InlineTemplateProps = {
  index: number;
  errors: FieldErrors;
  registerField: (fieldName: string, ruleName?: string) => UseFormRegisterReturn;
  onRemove: () => void;
};

/**
 * TODO: WIP
 * @param open
 * @param handleClose
 * @param handleSubmitted
 * @constructor
 */
export const LibraryCreateDialog = ({ open, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const titleCheckingState = useLibraryCreateFormStore((state) => state.titleUniqueProcessing);

  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
    defaultValues: { title: "", fields: [{ name: "", type: "line" }] },
  });
  const { registerField, registerFieldDebounced } = useFormValidation("libraryCreate", useHookForm);
  const { formState, reset, handleSubmit, control, watch } = useHookForm;
  const { errors } = formState;
  const { append, remove } = useFieldArray({ control, name: "fields" });

  const watchingFields = watch("fields");
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddNewField = () => append({ name: "", type: LibraryElementEnum.line }, { shouldFocus: false });
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
        <DialogTitle variant={"h5"}>{t("libraryCreateDialog.title")}</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 640, maxHeight: { sm: 640 } }}>
          <CustomTextField
            {...registerFieldDebounced(1000, "title")}
            label={t("libraryCreateDialog.libraryTitle")}
            errorMessage={errors.title?.message as string}
            margin="none"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {titleCheckingState ? <HourglassBottomOutlined /> : <DriveFileRenameOutlineOutlined />}
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle1" children={t("libraryCreateDialog.fieldsSet")} mt={1} />
          <Divider sx={{ mb: 0.5 }} />
          {watchingFields.map((field, index) => {
            return (
              <InputLineTemplate
                key={index}
                index={index}
                registerField={registerField}
                errors={errors}
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
            children={fullScreen ? t("libraryCreateDialog.field") : t("libraryCreateDialog.addNewField")}
          />
          <Box flex="1 0 auto" />
          <Button variant="text" onClick={handleCloseWithReset} children={t("common.cancel")} />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={14} /> : <SaveAsOutlined />}
            children={t("common.create")}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const InputLineTemplate = ({ index, registerField, errors, onRemove }: InlineTemplateProps) => {
  const { t } = useTranslation();
  const leading = index === 0;
  return (
    <Grid container spacing={1} alignItems="stretch">
      <Grid item xs={12} sm={7}>
        <CustomTextField
          {...registerField(`fields.${index}.name`, "name")}
          label={t("libraryCreateDialog.fieldName")}
          errorMessage={(errors as FieldErrors<{ fields: FieldValues[] }>)?.fields?.[index]?.name?.message as string}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={10} sm={4}>
        <CustomInputDropdown
          {...registerField(`fields.${index}.type`, "type")}
          label={t("libraryCreateDialog.fieldType")}
          helperText={""}
          disabled={leading}
        />
      </Grid>
      <Grid item xs={2} sm={1} textAlign={"right"}>
        <FormControl size="small" margin="dense">
          <Tooltip
            title={t(leading ? "libraryCreateDialog.fieldCantBeRemoved" : "libraryCreateDialog.removeField")}
            placement="left"
            arrow
          >
            <span>
              <IconButton aria-label="delete" disabled={leading} onClick={onRemove}>
                <RemoveCircleOutlineOutlined />
              </IconButton>
            </span>
          </Tooltip>
        </FormControl>
      </Grid>
    </Grid>
  );
};

const CustomTextField = forwardRef((props: InputCustomProps & TextFieldProps, ref) => {
  const { name, helperText, errorMessage, ...textFieldProps } = props;
  return (
    <TextField
      inputRef={ref}
      fullWidth
      size="small"
      margin="dense"
      id={name}
      name={name}
      autoComplete="off"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      {...textFieldProps}
    />
  );
});

const CustomInputDropdown = forwardRef((props: InputCustomProps & TextFieldProps, ref) => {
  const { name, helperText, errorMessage, ...textFieldProps } = props;
  const { t } = useTranslation();

  return (
    <TextField
      inputRef={ref}
      select
      fullWidth
      size="small"
      margin="dense"
      id={name}
      name={name}
      error={!!errorMessage}
      defaultValue={LibraryElementEnum.line}
      helperText={errorMessage || helperText}
      {...textFieldProps}
      children={Object.entries(LibraryElementEnum).map(([key, definition]) => (
        <MenuItem key={key} value={definition} children={t(`libraryTypes.${definition}`)} />
      ))}
    />
  );
});
