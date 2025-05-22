import { Turnstile } from '@marsidev/react-turnstile';
import { Alert, Box, Button, Collapse } from '@mui/material';
import { debounce } from '@mui/material';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { emailValidationPattern } from '../../core';
import { useUserSignupRequest } from '../../requests/authRequests';
import { useEmailValidationRequest } from '../../requests/validationRequests';
import { useThemeStore } from '../../store/system/useThemeStore';
import { useLanguageStore, useTranslationStore } from '../../store/system/useTranslationStore';
import { useSignupFormStore } from '../../store/useSignupFormStore';
import { BadgeOutlined, PersonAddAltOutlined } from '../icons';
import { EmailInput } from '../inputs/EmailInput';
import { PasswordInput } from '../inputs/PasswordInput';
import { SelectInput } from '../inputs/SelectInput';
import { TextInput } from '../inputs/TextInput';

import type { FormValidationRules, RegisterCaptchaProps, SignupFormData, UseFormService } from '../../core/types';
import type { Language } from '../../store/system/useTranslationStore';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { PaletteMode } from '@mui/material';
import type { SubmitErrorHandler, SubmitHandler, ValidateResult } from 'react-hook-form';

type FormType = SignupFormData;

/**
 * Sign Up (Register) Form functional component
 */
export const SignupForm = () => {
  const { t, i18n } = useTranslation();

  const emailChecking = useSignupFormStore((state) => state.emailUniqueProcessing);
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore((state) => state);
  const { language, setLanguage } = useLanguageStore((state) => state);
  const languages = useTranslationStore((state) => state.languages);

  const { registerField, registerCaptcha, handleSubmit, errors, dismissRootError, isSubmitting } = useFormService();

  return (
    <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant='filled' severity='error' onClose={dismissRootError} sx={{ my: 2 }}>
          {errors.root?.serverError.message}
        </Alert>
      </Collapse>
      <TextInput
        {...registerField('name')}
        label={t('signupPage.username')}
        helperText={t('signupPage.usernameHint')}
        errorMessage={errors.name?.message}
        autoComplete={'name'}
        icon={<BadgeOutlined />}
      />
      <EmailInput
        {...registerField('email')}
        label={t('signupPage.email')}
        helperText={t('signupPage.emailAsLoginHint')}
        errorMessage={errors.email?.message}
        loadingState={emailChecking}
      />
      <PasswordInput
        {...registerField('password')}
        label={t('signupPage.password')}
        helperText={t('signupPage.passwordHint')}
        errorMessage={errors.password?.message}
      />
      <PasswordInput
        {...registerField('passwordRepeat')}
        label={t('signupPage.passwordRepeat')}
        helperText={t('signupPage.passwordRepeatHint')}
        errorMessage={errors.passwordRepeat?.message}
      />
      <SelectInput
        {...registerField('locale')}
        onChange={async (event) => setLanguage(event.target.value as Language)}
        value={language}
        label={t('signupPage.language')}
        helperText={t('signupPage.languageHint')}
        items={languages}
      />
      <SelectInput
        {...registerField('theme')}
        onChange={async (event) => setThemeMode(event.target.value as PaletteMode)}
        value={themeMode}
        label={t('signupPage.theme')}
        helperText={t('signupPage.themeHint')}
        items={{ light: t('theme.light'), dark: t('theme.dark') }}
      />
      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Turnstile
          {...registerCaptcha?.()}
          siteKey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY}
          options={{ size: 'flexible', language: i18n.language }}
        />
      </Box>
      <Box sx={{ mt: 3, mb: 2 }}>
        <Button type='submit' fullWidth variant='contained' loading={isSubmitting} endIcon={<PersonAddAltOutlined />}>
          {t('signupPage.signUpBtn')}
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Custom hook for managing the sign-up form using react-hook-form.
 *
 * This hook includes form validation logic, field registration, and helper functions to manage the state of the form.
 * It handles validation for fields such as name, email, password, password confirmation, and CAPTCHA response.
 */
const useFormService = (): UseFormService<FormType> => {
  const { t } = useTranslation();
  const captchaRef = useRef<TurnstileInstance>(null);

  const signupRequest = useUserSignupRequest();
  const validateEmail = useEmailValidationRequest();
  const isSubmitting = signupRequest.status === 'pending';

  const useHookForm = useForm<FormType>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const { register, handleSubmit } = useHookForm;
  const { formState, setError, clearErrors, setValue, reset, getFieldState, trigger } = useHookForm;
  const { errors } = formState;

  const registerField = useCallback(
    (fieldName: keyof FormType) => {
      const rules: Record<keyof FormType, FormValidationRules> = {
        name: {
          setValueAs: (value: string) => value.trim(),
          required: t('formValidation.usernameRequired'),
          minLength: { value: 3, message: t('formValidation.usernameMinLength', { n: 3 }) },
        },
        email: {
          setValueAs: (value: string) => value.trim().toLowerCase(),
          required: t('formValidation.emailRequired'),
          pattern: {
            value: emailValidationPattern,
            message: t('formValidation.emailInvalid'),
          },
          validate: {
            uniqueValidation: async (value: string): Promise<ValidateResult> => {
              return await validateEmail
                .mutateAsync({ email: value })
                .then((response) => response?.message)
                .catch((error) => error.message);
            },
          },
        },
        password: {
          required: t('formValidation.passwordRequired'),
          minLength: { value: 8, message: t('formValidation.passwordMinLength', { n: 8 }) },
          validate: {
            matchesPasswords: () => {
              const prevField = 'passwordRepeat';
              const { isDirty, invalid } = getFieldState(prevField);
              if (isDirty || invalid) {
                trigger(prevField).then(() => true);
              }

              return true;
            },
          },
        },
        passwordRepeat: {
          required: t('formValidation.passwordRepeatRequired'),
          validate: {
            matchesPasswords: (value, formValues) => {
              const message = t('formValidation.passwordRepeatNotMatch');
              const { password } = formValues;

              return password === value || message;
            },
          },
        },
        'cf-turnstile-response': {
          required: t('formValidation.captchaRequired'),
        },
      };

      const registerReturn = register(fieldName as string, rules[fieldName]);

      switch (fieldName) {
        case 'email':
          return { ...registerReturn, onChange: debounce(registerReturn.onChange, 1000) };
        case 'password':
          return { ...registerReturn, onChange: debounce(registerReturn.onChange, 500) };
        default:
          return registerReturn;
      }
    },
    [getFieldState, register, t, trigger, validateEmail],
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
    void signupRequest.mutateAsync(data, {
      onError: (reason) => {
        reset({ password: '', passwordRepeat: '' });
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
    isSubmitting,
    errors,
    dismissRootError: () => clearErrors('root'),
  };
};
