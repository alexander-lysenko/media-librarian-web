import { Turnstile } from "@marsidev/react-turnstile";
import { Alert, Box, Button, CircularProgress, Collapse, InputAdornment, TextField } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../core/actions";
import { useFormValidation } from "../../hooks";
import { usePasswordRecoveryRequest } from "../../requests/authRequests";
import { AlternateEmailOutlined, Send } from "../icons";
import { FormDialog } from "../ui/modals/FormDialog";

import type { InputCustomProps } from "../../core/types";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import type { TextFieldProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

interface Props {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
}

interface PasswordRecoveryFormData extends FieldValues {
  email: string;
}

/**
 * Password Reset Init (Recovery Request) Dialog
 */
export const PasswordResetInitDialog = ({ open, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const captchaRef = useRef<TurnstileInstance>(null);

  const passwordRecoveryRequest = usePasswordRecoveryRequest();
  const loading = passwordRecoveryRequest.status === "pending";

  const useHookForm = useForm<PasswordRecoveryFormData>({ mode: "onBlur", reValidateMode: "onChange" });
  const { registerField } = useFormValidation("passwordRecoveryRequest", useHookForm);
  const { formState, reset, handleSubmit, setValue, setError, clearErrors } = useHookForm;
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<PasswordRecoveryFormData> = (data, event) => {
    void passwordRecoveryRequest.mutateAsync(data, {
      onSuccess: () => {
        handleCloseWithReset(event as SyntheticEvent);
        enqueueSnack({ type: "success", message: t("passwordRecovery.emailSent") });
      },
      onError: (reason) => {
        setError("root.serverError", { message: reason.message });
        captchaRef.current?.reset();
      },
    });
  };

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick") {
      event.preventDefault();
      return false;
    }

    reset({ email: "" });
    onClose(event, reason);
  };

  return (
    <FormDialog open={open} fullWidth onSubmit={handleSubmit(onValidSubmit)} onClose={handleCloseWithReset}>
      <FormDialog.Title>{t("passwordRecovery.title")}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t("passwordRecovery.subtitle")}</FormDialog.Subtitle>
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
      </FormDialog.Content>
      <FormDialog.Actions>
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
      </FormDialog.Actions>
    </FormDialog>
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
