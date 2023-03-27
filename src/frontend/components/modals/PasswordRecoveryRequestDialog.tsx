import { AlternateEmailOutlined, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
  InputAdornment,
  TextField,
  TextFieldProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { ChangeEvent, FocusEvent, forwardRef, SyntheticEvent, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";

type Props = {
  handleSubmitted: (event: SyntheticEvent | Event) => void;
  handleClose: (event: SyntheticEvent | Event, reason?: string) => void;
  open: boolean;
};

type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage: string | undefined;
};

/**
 * Password Recovery Request Dialog
 * @param { open, handleClose }
 * @constructor
 */
export const PasswordRecoveryRequestDialog = ({ open, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState<boolean>(false);

  const usePasswordRecoveryRequestForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { registerField } = useFormValidation("passwordRecoveryRequest", usePasswordRecoveryRequestForm);
  const { formState, reset, handleSubmit } = usePasswordRecoveryRequestForm;
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    console.log(data);
    setLoading(true);

    setTimeout(() => {
      // simulate request
      handleCloseWithReset(event as SyntheticEvent);
      handleSubmitted(event as SyntheticEvent);
    }, 2000);
  };
  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick") {
      event.preventDefault();
      return false;
    }

    reset({ email: "" });
    setLoading(false);
    handleClose(event, reason);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={handleCloseWithReset}
      fullScreen={fullScreen}
      TransitionComponent={Grow}
      transitionDuration={120}
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit)} sx={{ mt: 1 }}>
        <DialogTitle variant={"h5"}>{t("passwordRecovery.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("passwordRecovery.subtitle")}</DialogContentText>
          <EmailTextField
            {...registerField("email")}
            label={t("loginPage.email")}
            errorMessage={errors.email?.message as string}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCloseWithReset}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={14} /> : <Send />}
            children={t("common.submit")}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const EmailTextField = forwardRef((props: InputProps & TextFieldProps, ref) => {
  return (
    <TextField
      inputRef={ref}
      autoFocus
      fullWidth
      size="small"
      margin="normal"
      id="passwordRecovery-email"
      name="email"
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="email"
      onChange={props.onChange}
      onBlur={props.onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <AlternateEmailOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
});
