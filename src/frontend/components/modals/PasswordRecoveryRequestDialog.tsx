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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { enqueueSnack } from "../../store/useSnackbarStore";

import type { InputCustomProps } from "../../core/types";
import type { TextFieldProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
};

/**
 * Password Recovery Request Dialog
 * TODO: WIP
 * @param { open, handleClose }
 * @constructor
 */
export const PasswordRecoveryRequestDialog = ({ open, onClose }: Props) => {
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
      enqueueSnack({ type: "success", message: t("passwordRecovery.emailSent") });
    }, 2000);
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

const EmailTextField = forwardRef((props: InputCustomProps & TextFieldProps, ref) => {
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
