import { yupResolver } from "@hookform/resolvers/yup";
import { AlternateEmailOutlined, LockOutlined, LockReset } from "@mui/icons-material";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { forwardRef, SyntheticEvent, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { object as yupShape, ref as yupRef, string } from "yup";

import { LocalizedStringFn, useTranslation } from "../../hooks/useTranslation";

type Props = {
  handleSubmitted: (event: React.SyntheticEvent | Event) => void;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  open: boolean;
};

type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage: string | undefined;
};

const makeValidationSchema = (t: LocalizedStringFn) =>
  yupShape({
    newPassword: string()
      .required(t("formValidation.passwordRequired"))
      .min(8, t("formValidation.passwordMinLength", { n: 8 })),
    newPasswordRepeat: string()
      .required(t("formValidation.passwordRepeatRequired"))
      .oneOf([yupRef("newPassword")], t("formValidation.passwordRepeatNotMatch")),
  });

/**
 * Password Reset Dialog
 * @param { open, handleClose }
 * @constructor
 */
export const PasswordResetDialog = ({ open, handleClose, handleSubmitted }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = makeValidationSchema(t);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      event.preventDefault();
      return false;
    }

    reset();
    setLoading(false);
    handleClose(event, reason);
  };

  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    console.log(data);
    setLoading(true);

    setTimeout(() => {
      // Submit request
      handleCloseWithReset(event as SyntheticEvent);
      handleSubmitted(event as SyntheticEvent);
    }, 2000);
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
        <DialogTitle variant={"h5"} sx={{ textAlign: "center" }}>
          {t("passwordReset.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant={"body2"} sx={{ mb: 1 }}>
            {t("passwordReset.subtitle")}
          </DialogContentText>
          <EmailTextField value={"lol@kek.gii"} />
          <PasswordTextField
            {...register("newPassword")}
            label={t("passwordReset.newPassword")}
            errorMessage={errors.newPassword?.message as string}
          />
          <PasswordTextField
            {...register("newPasswordRepeat")}
            label={t("passwordReset.newPasswordRepeat")}
            errorMessage={errors.newPasswordRepeat?.message as string}
          />
        </DialogContent>
        <DialogActions sx={{ mx: 2, mb: 1, justifyContent: "space-between" }}>
          <Button variant="text" fullWidth={fullScreen} onClick={handleCloseWithReset}>
            {t("passwordReset.backToSignIn")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth={fullScreen}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={14} /> : <LockReset />}
          >
            {t("common.save")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const EmailTextField = forwardRef((props: Partial<InputProps>, ref) => {
  return (
    <TextField
      inputRef={ref}
      size="small"
      margin="normal"
      fullWidth
      disabled
      id="passwordReset-email"
      name="email"
      value={props.value}
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

const PasswordTextField = forwardRef((props: Partial<InputProps>, ref) => {
  return (
    <TextField
      inputRef={ref}
      size="small"
      margin="normal"
      fullWidth
      type="password"
      id={"passwordReset-" + props.name}
      name={props.name}
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="off"
      onChange={props.onChange}
      onBlur={props.onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <LockOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
});
