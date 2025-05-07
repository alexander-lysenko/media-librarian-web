import { Turnstile } from '@marsidev/react-turnstile';
import { Alert, Box, Button, Collapse } from '@mui/material';
import { useRef } from 'react';
import { type SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useFormValidation } from '../../hooks';
import { useUserSignupRequest } from '../../requests/authRequests';
import { useThemeStore } from '../../store/system/useThemeStore';
import { useLanguageStore, useTranslationStore } from '../../store/system/useTranslationStore';
import { useSignupFormStore } from '../../store/useSignupFormStore';
import { BadgeOutlined, PersonAddAltOutlined } from '../icons';
import { EmailInput } from '../inputs/EmailInput';
import { PasswordInput } from '../inputs/PasswordInput';
import { SelectInput } from '../inputs/SelectInput';
import { TextInput } from '../inputs/TextInput';

import type { SignupFormData } from '../../core/types';
import type { Language } from '../../store/system/useTranslationStore';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { PaletteMode } from '@mui/material';
import type { ChangeEvent } from 'react';
import type { ChangeHandler, SubmitHandler } from 'react-hook-form';

/**
 * Sign Up (Register) Form functional component
 */
export const SignupForm = () => {
  const { t, i18n } = useTranslation();

  const captchaRef = useRef<TurnstileInstance>(null);

  const { mode: themeMode, setMode: setThemeMode } = useThemeStore((state) => state);
  const { language, setLanguage } = useLanguageStore((state) => state);
  const languages = useTranslationStore((state) => state.languages);
  const emailChecking = useSignupFormStore((state) => state.emailUniqueProcessing);

  const signupRequest = useUserSignupRequest();
  const loading = signupRequest.status === 'pending';

  const useHookForm = useForm<SignupFormData>({ mode: 'onBlur', reValidateMode: 'onChange' });
  const { registerField, registerFieldDebounced } = useFormValidation('signup', useHookForm);
  const { formState, handleSubmit, reset, setError } = useHookForm;
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<SignupFormData> = (data) => {
    void signupRequest.mutateAsync(data, {
      onError: (reason) => {
        reset({ password: '', passwordRepeat: '' });
        setError('root.serverError', { message: reason.message });
        captchaRef.current?.reset();
      },
    });
  };

  const onInvalidSubmit: SubmitErrorHandler<SignupFormData> = () => {
    if (errors['cf-turnstile-response']) {
      setError('root.serverError', { message: errors['cf-turnstile-response']?.message as string });
    }
  };

  const handleLanguageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as Language);
  };

  const handleThemeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.value as PaletteMode);
  };

  return (
    <Box component='form' noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant='filled' severity='error' onClose={() => reset({ root: '' })} sx={{ my: 2 }}>
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
        {...registerFieldDebounced(1000, 'email')}
        label={t('signupPage.email')}
        helperText={t('signupPage.emailAsLoginHint')}
        errorMessage={errors.email?.message}
        loadingState={emailChecking}
      />
      {/* todo: fix rerenders on revalidation */}
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
        onChange={handleLanguageSelect as ChangeHandler}
        value={language}
        label={t('signupPage.language')}
        helperText={t('signupPage.languageHint')}
        items={languages}
      />
      <SelectInput
        {...registerField('theme')}
        onChange={handleThemeSelect as ChangeHandler}
        value={themeMode}
        label={t('signupPage.theme')}
        helperText={t('signupPage.themeHint')}
        items={{
          light: t('theme.light'),
          dark: t('theme.dark'),
        }}
      />
      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Turnstile
          ref={captchaRef}
          options={{ size: 'flexible', language: i18n.language }}
          siteKey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY}
          onWidgetLoad={() => registerField('cf-turnstile-response')}
          onSuccess={(token) => useHookForm.setValue('cf-turnstile-response', token)}
          onExpire={() => captchaRef.current?.reset()}
        />
      </Box>
      <Button
        type='submit'
        fullWidth
        variant='contained'
        loading={loading}
        endIcon={<PersonAddAltOutlined />}
        sx={{ mt: 3, mb: 2 }}
        children={t('signupPage.signUpBtn')}
      />
    </Box>
  );
};
