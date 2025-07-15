import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { createFetch } from '../core';
import { enqueueSnack } from '../core/actions';
import { AppRoutes } from '../core/enums';
import { changePasswordEndpoint, profileEndpoint } from '../core/links';
import { useProfileStore } from '../store/useProfileStore';

import type { PasswordChangeFormData } from '../core/types';
import type { ProfileData } from '../store/useProfileStore';

type GetProfileResponse = ProfileData;

/**
 * Request to get profile data
 * [GET] /api/v1/profile
 */
export const useProfileGetRequest = () => {
  const navigate = useNavigate();
  const setProfile = useProfileStore((state) => state.setProfile);

  const { refetch, status, data, error } = useQuery({
    queryKey: ['get', 'profile'],
    queryFn: (): Promise<GetProfileResponse> => createFetch({ url: profileEndpoint, method: 'GET' }),
  });

  useEffect(() => {
    if (status === 'success') {
      setProfile(data);
    }
    if (status === 'error' && error.code === '401') {
      enqueueSnack({ type: 'error', message: error.message });

      void navigate({ href: AppRoutes.login, replace: true });
    }
  }, [data, status, setProfile, error, navigate]);

  return { refetch, status, data, error };
};

/**
 * Request to update profile data of the user.
 * [PATCH] /api/v1/profile
 */
export const useProfilePatchRequest = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, status, data, error } = useMutation({
    mutationKey: ['patch', 'profile'],
    mutationFn: async (data: Partial<ProfileData['user']>): Promise<GetProfileResponse> => {
      return await createFetch({
        url: profileEndpoint,
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['get', 'profile'] });
    },
  });

  return { mutateAsync, status, data, error };
};

/**
 * Request to change the user's password.
 * [PUT] /api/v1/profile/password
 */
export const useProfileChangePasswordRequest = () => {
  const { t } = useTranslation();

  const { mutateAsync, status, data, error } = useMutation({
    mutationKey: ['put', 'profile', 'password'],
    mutationFn: async (data: PasswordChangeFormData): Promise<void> => {
      return await createFetch({
        url: changePasswordEndpoint,
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      enqueueSnack({
        type: 'success',
        message: t('dialogs.changePasswordDialog.success'),
      });
    },
  });

  return { mutateAsync, status, data, error };
};
