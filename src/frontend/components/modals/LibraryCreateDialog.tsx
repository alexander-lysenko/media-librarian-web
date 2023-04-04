import { AddCircleOutlined, RemoveCircleOutlineOutlined, SaveAsOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  Grow,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { LibraryElementEnum } from "../../core/enums";
import { CustomInputProps } from "../../core/types";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { useFormValidation } from "../../hooks";

type Props = {
  handleSubmitted: (event: React.SyntheticEvent | Event) => void;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  open: boolean;
};

type InlineTemplateProps = {
  registerField: (fieldName: string) => UseFormRegisterReturn;
};

export const LibraryCreateDialog = ({ open, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(false);

  const useCreateLibraryForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { registerField } = useFormValidation("passwordRecovery", useCreateLibraryForm);
  const { formState, reset, handleSubmit } = useCreateLibraryForm;
  const { errors } = formState;
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} fullWidth fullScreen={fullScreen} TransitionComponent={Grow} transitionDuration={120}>
      <DialogTitle variant={"h5"}>{t("createLibrary.title")}</DialogTitle>
      <DialogContent dividers sx={{ minHeight: 360 }}>
        <Box component="form" noValidate onSubmit={() => false}>
          <InputLineTemplate registerField={registerField} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => false}
          startIcon={<AddCircleOutlined />}
          children={t("createLibrary.addNewField")}
        />
        <Box sx={{ flex: "1 0 auto" }} />
        <Button variant="text" onClick={handleClose} children={t("common.cancel")} />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={14} /> : <SaveAsOutlined />}
          children={t("common.create")}
        />
      </DialogActions>
    </Dialog>
  );
};

const InputLineTemplate = ({ registerField }: InlineTemplateProps) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={1} alignItems="stretch">
      <Grid item xs={12} sm={7}>
        <InputNameTextField
          {...registerField("newPasswordRepeat")}
          label={t("createLibrary.fieldName")}
          name="name"
          onBlur={() => false}
          onChange={() => false}
          helperText={""}
        />
      </Grid>
      <Grid item xs={10} sm={4}>
        <InputTypeSelect
          label={t("createLibrary.fieldType")}
          name="type"
          onBlur={() => false}
          onChange={() => false}
          helperText={""}
        />
      </Grid>
      <Grid item xs={2} sm={1} textAlign={"right"}>
        <Tooltip title={t("createLibrary.removeField")} placement="left" arrow>
          <IconButton aria-label="delete" sx={{ mt: 1 }}>
            <RemoveCircleOutlineOutlined />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

const InputNameTextField = forwardRef((props: CustomInputProps, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      size="small"
      margin="dense"
      id="name"
      name="name"
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="off"
      onChange={props.onChange}
      onBlur={props.onBlur}
    />
  );
});

const InputTypeSelect = forwardRef((props: CustomInputProps, ref) => {
  const { t } = useTranslation();

  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="type">{props.label}</InputLabel>
      <Select
        inputRef={ref}
        labelId="type"
        id="type"
        name="type"
        value={props.value || ""}
        label={props.label}
        onChange={props.onChange as (event: SelectChangeEvent) => void | undefined}
      >
        <MenuItem key={"none"} value="" children={t("createLibrary.optionNone")} />
        {Object.entries(LibraryElementEnum).map(([key, definition]) => (
          <MenuItem key={key} value={definition}>
            {t(`libraryTypes.${definition}`)}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{props.errorMessage || props.helperText}</FormHelperText>
    </FormControl>
  );
});
