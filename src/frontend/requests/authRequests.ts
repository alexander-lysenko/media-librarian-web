import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { createFetch } from '../core';
import { enqueueSnack } from '../core/actions';
import { AppRoutes } from '../core/enums';
import { userLoginEndpoint, userPasswordResetEndpoint, userSignupEndpoint } from '../core/links';
import { useAuthCredentialsStore } from '../store/useAuthCredentialsStore';

import type { LoginResponse, SignupResponse } from '../core/types';
import type { LoginFormData, PasswordResetFormData, SignupFormData } from '../core/types';

/**
 * Request to signup / register / create a user.
 * [POST] /api/v1/user/signup
 */
export const useUserSignupRequest = () => {
  const navigate = useNavigate();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['post', 'user', 'signup'],
    mutationFn: (data: SignupFormData): Promise<SignupResponse> => {
      return createFetch({
        url: userSignupEndpoint,
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'omit',
      });
    },
    onSuccess: () => {
      void navigate({ href: AppRoutes.login, replace: true });
    },
    // onError should be defined in the places of request's usage
  });

  return { mutateAsync, status };
};

/**
 * Request to authenticate a user.
 * [POST] /api/v1/user/login
 */
export const useUserLoginRequest = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);

  const { mutateAsync, status } = useMutation({
    mutationKey: ['post', 'user', 'login'],
    mutationFn: (data: LoginFormData): Promise<LoginResponse> => {
      return createFetch({
        url: userLoginEndpoint,
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'omit',
      });
    },
    onSuccess: (response, request) => {
      const email = request.email;
      const { token, redirectTo } = response;
      setCredentials(email, token);
      void navigate({ href: redirectTo, replace: true });
    },
    // onError should be defined in the places of request's usage
  });

  return { mutateAsync, status };
};

/**
 * Request to initiate password reset.
 * [POST] /api/v1/user/password-reset
 */
export const usePasswordRecoveryRequest = () => {
  const { t } = useTranslation();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['post', 'user', 'password-reset'],
    mutationFn: (data: { email: string }) => {
      return createFetch({
        url: userPasswordResetEndpoint,
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'omit',
      });
    },
    onSuccess: () => {
      enqueueSnack({ type: 'success', message: t('passwordRecovery.emailSent') });
    },
  });

  return { mutateAsync, status };
};

/**
 * Request to perform password reset.
 * [PUT] /api/v1/user/password-reset
 */
export const usePasswordResetRequest = () => {
  const { t } = useTranslation();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['put', 'user', 'password-reset'],
    mutationFn: (data: PasswordResetFormData) => {
      return createFetch({
        url: userPasswordResetEndpoint,
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'omit',
      });
    },
    onSuccess: () => {
      enqueueSnack({ type: 'success', message: t('passwordReset.successfullyReset') });
    },
  });

  return { mutateAsync, status };
};
