import {
  Alert,
  Box,
  Button,
  CircularProgress, Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  type DialogProps,
  DialogTitle,
  Grow,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../core/actions";
import { useFormValidation } from "../../hooks";
import { usePasswordRecoveryRequest } from "../../requests/useAuthRequests";
import { AlternateEmailOutlined, Send } from "../icons";

import type { InputCustomProps } from "../../core/types";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { TextFieldProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
};

/**
 * Password Reset Init (Recovery Request) Dialog
 * @param { open, handleClose }
 * @constructor
 */
export const PasswordResetInitDialog = ({ open, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState<boolean>(false);
  const captchaRef = useRef<TurnstileInstance>(null);

  const passwordRecoveryRequest = usePasswordRecoveryRequest();

  const useHookForm = useForm({ mode: "onBlur", reValidateMode: "onChange" });
  const { registerField } = useFormValidation("passwordRecoveryRequest", useHookForm);
  const { formState, reset, handleSubmit, setValue, setError, clearErrors } = useHookForm;
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    console.log(data);
    setLoading(true);
    passwordRecoveryRequest.setResponseEvents({
      onSuccess: () => {
        handleCloseWithReset(event as SyntheticEvent);
        enqueueSnack({ type: "success", message: t("passwordRecovery.emailSent") });
      },
      onError: (reason) => {
        setLoading(false);
        setError("root.serverError", { message: reason.message });
        captchaRef.current?.reset();
      },
    });
    await passwordRecoveryRequest.fetch(data as never);
  };

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick") {
      event.preventDefault();
      return false;
    }

    reset({ email: "" });
    setLoading(false);
    onClose(event, reason);
  };

  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    fullScreen: fullScreen,
    disableRestoreFocus: true,
    closeAfterTransition: true,
    slots: { transition: Grow },
    slotProps: {
      transition: { timeout: 120 },
      paper: {
        component: "form",
        onSubmit: handleSubmit(onValidSubmit),
      },
    },
  };

  return (
    <Dialog {...dialogProps} onClose={handleCloseWithReset}>
      <DialogTitle variant={"h5"}>{t("passwordRecovery.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("passwordRecovery.subtitle")}</DialogContentText>
        <Collapse in={!!formState.errors.root?.serverError} unmountOnExit>
          <Alert variant="filled" severity="error" onClose={() => clearErrors("root")} sx={{ my: 2 }}>
            {formState.errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <EmailTextField
          {...registerField("email")}
          label={t("loginPage.email")}
          errorMessage={errors.email?.message as string}
        />
        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Turnstile
            ref={captchaRef}
            options={{ size: "flexible", language: i18n.language }}
            siteKey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY}
            onWidgetLoad={() => registerField("cf-turnstile-response")}
            onSuccess={(token) => setValue("cf-turnstile-response", token)}
            onExpire={() => {
              captchaRef.current?.reset();
            }}
          />
        </Box>
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
    </Dialog>
  );
};

const EmailTextField = (props: InputCustomProps & TextFieldProps) => {
  const endAdornment = (
    <InputAdornment position="end">
      <AlternateEmailOutlined />
    </InputAdornment>
  );

  return (
    <TextField
      inputRef={props.ref}
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
      slotProps={{ input: { endAdornment } }}
    />
  );
};
