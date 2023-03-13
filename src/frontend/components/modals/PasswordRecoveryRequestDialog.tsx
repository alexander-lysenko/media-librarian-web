import { yupResolver } from "@hookform/resolvers/yup";
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
import { object as yupShape, string } from "yup";

import { LocalizedStringFn, useTranslation } from "../../hooks/useTranslation";

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

const makeValidationSchema = (t: LocalizedStringFn) =>
  yupShape({
    email: string()
      .required(t("formValidation.emailRequired"))
      .email(t("formValidation.emailInvalid"))
      .lowercase()
      .trim(),
  });

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

  const schema = makeValidationSchema(t);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });

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
        <DialogTitle variant={"h5"} sx={{ textAlign: "center" }}>
          {t("passwordRecovery.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant={"body2"} sx={{ mb: 1 }}>
            {t("passwordRecovery.subtitle")}
          </DialogContentText>
          <EmailTextField
            {...register("email")}
            label={t("loginPage.email")}
            errorMessage={errors.email?.message as string}
          />
        </DialogContent>
        <DialogActions sx={{ mx: 2, mb: 1 }}>
          <Button variant="text" onClick={handleCloseWithReset}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={14} /> : <Send />}
          >
            {t("common.submit")}
          </Button>
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
