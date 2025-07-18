import { Turnstile } from '@marsidev/react-turnstile';
import { Alert, Box, Button, Checkbox, Collapse, FormControlLabel } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { emailValidationPattern } from '../../core';
import { useUserLoginRequest } from '../../requests/authRequests';
import { LoginOutlined } from '../icons';
import { EmailInput } from '../inputs/EmailInput';
import { PasswordInput } from '../inputs/PasswordInput';

import type { FormValidationRules, LoginFormData, RegisterCaptchaProps } from '../../core/types';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

type FormType = LoginFormData;

/**
 * Sign In (Login) Form functional component
 */
export const LoginForm = () => {
  const { t, i18n } = useTranslation();

  const { registerField, registerCaptcha, handleSubmit, errors, dismissRootError, isSubmitting } = useLoginForm();

  return (
    <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant='filled' severity='error' onClose={dismissRootError} sx={{ my: 2 }}>
          {errors.root?.serverError.message as string}
        </Alert>
      </Collapse>
      <EmailInput
        {...registerField('email')}
        label={t('loginPage.email')}
        errorMessage={errors.email?.message as string}
      />
      <PasswordInput
        {...registerField('password')}
        label={t('loginPage.password')}
        errorMessage={errors.password?.message as string}
      />
      <FormControlLabel
        control={<Checkbox color='primary' {...registerField('rememberMe')} />}
        label={t('loginPage.rememberMe')}
      />
      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Turnstile
          {...registerCaptcha?.()}
          siteKey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY}
          options={{ size: 'flexible', language: i18n.language }}
        />
      </Box>
      <Box sx={{ mt: 3, mb: 2 }}>
        <Button type='submit' fullWidth variant='contained' loading={isSubmitting} endIcon={<LoginOutlined />}>
          {t('loginPage.signInBtn')}
        </Button>
      </Box>
    </Box>
  );
};

/**
 * A custom React hook that provides form handling logic for a login form.
 */
const useLoginForm = () => {
  const { t } = useTranslation();
  const captchaRef = useRef<TurnstileInstance>(null);

  const useLoginRequest = useUserLoginRequest();

  const useHookForm = useForm<FormType>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const { formState, register, handleSubmit } = useHookForm;
  const { setError, clearErrors, setValue, reset, resetField } = useHookForm;
  const { errors } = formState;

  // prettier-ignore
  const rules = useMemo((): Record<keyof FormType, FormValidationRules> => ({
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t('formValidation.emailRequired'),
        pattern: {
          value: emailValidationPattern,
          message: t('formValidation.emailInvalid'),
        },
      },
      password: {
        required: t('formValidation.passwordRequired'),
      },
      rememberMe: {
        setValueAs: (value: string) => !!value,
      },
      'cf-turnstile-response': {
        required: t('formValidation.captchaRequired'),
      },
    }), [t],
  );

  const registerField = useCallback(
    (fieldName: keyof FormType) => register(fieldName as string, rules[fieldName]),
    [register, rules],
  );

  const registerCaptcha = useCallback((): RegisterCaptchaProps => {
    return {
      ref: captchaRef,
      onWidgetLoad: () => registerField('cf-turnstile-response'),
      onSuccess: (token) => setValue('cf-turnstile-response', token),
      onExpire: () => captchaRef.current?.reset(),
    };
  }, [registerField, setValue]);

  const onValidSubmit: SubmitHandler<FormType> = (data) => {
    void useLoginRequest.mutateAsync(data, {
      onSuccess: () => {
        reset();
      },
      onError: (reason) => {
        resetField('password');
        setError('root.serverError', { message: reason.message });
        captchaRef.current?.reset();
      },
    });
  };

  const onInvalidSubmit: SubmitErrorHandler<FormType> = () => {
    if (errors['cf-turnstile-response']) {
      setError('root.serverError', { message: errors['cf-turnstile-response']?.message as string });
    }
  };

  return {
    registerField,
    registerCaptcha,
    handleSubmit: handleSubmit(onValidSubmit, onInvalidSubmit),
    isSubmitting: useLoginRequest.status === 'pending',
    errors,
    dismissRootError: () => clearErrors('root'),
  };
};
