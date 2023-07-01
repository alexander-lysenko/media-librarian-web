import { LoginOutlined } from "@mui/icons-material";
import { Alert, Box, Button, Checkbox, CircularProgress, Collapse, FormControlLabel } from "@mui/material";
import { useEffect, useMemo } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { BaseApiResponseEvents } from "../../core";
import { useFormValidation } from "../../hooks";
import { useLoginRequest } from "../../requests/auth/useLoginRequest";
import { EmailInput } from "../inputs/EmailInput";
import { PasswordInput } from "../inputs/PasswordInput";

/**
 * Sign In (aka Login) Form functional component
 */
export const LoginForm = () => {
  const { t } = useTranslation();
  // const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { registerField } = useFormValidation("login", useHookForm);
  const { formState, handleSubmit, reset, setError } = useHookForm;
  const { errors } = formState;

  const { status, fetch: submit, abort, setRequestEvents } = useLoginRequest();
  const loading = status === "LOADING";

  const responseEvents = useMemo(
    (): BaseApiResponseEvents => ({
      onSuccess: () => reset(),
      onReject: (reason) => {
        console.log("Rejected", reason);
        reset({ password: "" });
        setError("root.serverError", { message: reason.response?.data.message || reason.message });
      },
    }),
    [reset, setError],
  );

  const onValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await submit({ email: data.email, password: data.password });
    abort();
  };
  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);

  useEffect(() => {
    setRequestEvents(responseEvents);
  }, [responseEvents, setRequestEvents]);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant="filled" severity="error" onClose={() => reset({ root: "" })} sx={{ my: 2 }}>
          {errors.root?.serverError.message as string}
        </Alert>
      </Collapse>
      <EmailInput
        {...registerField("email")}
        label={t("loginPage.email")}
        errorMessage={errors.email?.message as string}
      />
      <PasswordInput
        {...registerField("password")}
        label={t("loginPage.password")}
        errorMessage={errors.password?.message as string}
      />
      <FormControlLabel
        control={<Checkbox color="primary" {...registerField("rememberMe")} />}
        label={t("loginPage.rememberMe")}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
        children={t("loginPage.signInBtn")}
        endIcon={loading ? <CircularProgress size={14} /> : <LoginOutlined />}
      />
    </Box>
  );
};
