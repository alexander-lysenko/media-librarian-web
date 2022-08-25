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
  InputAdornment,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
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
  const [loading, setLoading] = React.useState(false);

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

  const handleCloseWithReset = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      event.preventDefault();
      return false;
    }

    reset({ newPassword: "", newPasswordRepeat: "" });
    setLoading(false);
    handleClose(event, reason);
  };

  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    console.log(data);
    setLoading(true);

    setTimeout(() => {
      // Submit request
      handleCloseWithReset(event as React.SyntheticEvent);
      handleSubmitted(event as React.SyntheticEvent);
    }, 2000);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={handleCloseWithReset}
      fullScreen={fullScreen}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" } as TransitionProps}
      transitionDuration={120}
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit)} sx={{ mt: 1 }}>
        <DialogTitle variant={"h5"} sx={{ textAlign: "center" }}>
          {t("passwordReset.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant={"body2"} sx={{ mb: 1 }}>
            {t("passwordReset.subtitle")}
          </DialogContentText>{" "}
          <TextField
            fullWidth
            size="small"
            margin="normal"
            id="email"
            name="email"
            disabled
            value={"lol@kek.gii"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AlternateEmailOutlined />
                </InputAdornment>
              ),
            }}
          />
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

const PasswordTextField = React.forwardRef((props: Partial<InputProps>, ref) => {
  return (
    <TextField
      inputRef={ref}
      size="small"
      margin="normal"
      fullWidth
      type="password"
      id={props.name}
      name={props.name}
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="current-password"
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
