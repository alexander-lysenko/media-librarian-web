import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { bindPathParams, createFetch } from '../core';
import { enqueueSnack } from '../core/actions';
import { librariesEndpoint, libraryEndpoint } from '../core/links';
import { useLibrariesStore, useSelectedLibraryStore } from '../store/library/useLibrariesStore';
import { useLibraryTableStore } from '../store/library/useLibraryTableStore';
import { useProfileStore } from '../store/useProfileStore';

import type { CreateLibraryResponse, GetLibrariesResponse, LibraryFormData, PatchLibraryResponse } from '../core/types';

interface LibraryId {
  id: number;
}

interface LibraryData {
  data: LibraryFormData;
}

/**
 * Request to get the schema of all available Libraries
 * [GET] /api/v1/libraries
 */
export const useLibrariesGetRequest = () => {
  const setLibraries = useLibrariesStore((state) => state.setLibraries);
  const setColumns = useLibraryTableStore((state) => state.setColumns);
  const getSelectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary);
  const profileLoaded = useProfileStore((state) => state.profile.user.id !== undefined);

  const { refetch, status, data, error } = useQuery({
    queryKey: ['get', 'libraries'],
    queryFn: (): Promise<GetLibrariesResponse> => createFetch({ url: librariesEndpoint, method: 'GET' }),
    select: (response) => response.data,
    enabled: profileLoaded || true, // todo: fix it
  });

  useEffect(() => {
    switch (status) {
      case 'success': {
        setLibraries(data);
        const fieldsOfSelectedLibrary = Object.entries(getSelectedLibrary()?.fields || {}) // prettier-ignore
          .map(([label, type]) => ({ label, type }));

        setColumns(fieldsOfSelectedLibrary);
        break;
      }
      case 'error':
        setLibraries([]);
        enqueueSnack({ type: 'error', message: `${error.code} ${error.message}` });
        break;
    }
  }, [setLibraries, error, status, data, getSelectedLibrary, setColumns]);

  return { refetch, status };
};

// noinspection JSUnusedGlobalSymbols
/**
 * Request to get the schema of a specific Library by its ID
 * [GET] /api/v1/libraries/{id}
 */
export const useLibraryGetRequest = (id: number) => {
  const { status } = useQuery({
    queryKey: ['get', 'libraries', id],
    queryFn: (): Promise<GetLibrariesResponse> =>
      createFetch({ url: bindPathParams(libraryEndpoint, { id }), method: 'GET' }),
    select: (response) => response.data,
    enabled: !!id,
  });

  return { status };
};

/**
 * Request to create a Library
 * [POST] /api/v1/libraries
 */
export const useLibraryCreateRequest = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const appendLibrary = useLibrariesStore((state) => state.appendLibrary);
  const setSelectedLibraryId = useSelectedLibraryStore((state) => state.setSelectedLibraryId);

  const { mutateAsync, status } = useMutation({
    mutationKey: ['post', 'libraries'],
    mutationFn: async ({ data }: LibraryData): Promise<CreateLibraryResponse> => {
      return await createFetch({
        url: librariesEndpoint,
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (response) => {
      appendLibrary(response.data);
      setSelectedLibraryId(response.data.id);
      enqueueSnack({
        type: 'success',
        message: t('notifications.libraryCreated', { title: response.data.title }),
      });
      await queryClient.invalidateQueries({ queryKey: ['get', 'libraries'], exact: true });
    },
  });

  return { mutateAsync, status };
};

/**
 * Request to delete a Library
 * [DELETE] /api/v1/libraries/{id}
 */
export const useLibraryDeleteRequest = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['delete', 'libraries'],
    mutationFn: async ({ id }: LibraryId): Promise<void> => {
      return await createFetch({
        url: bindPathParams(libraryEndpoint, { id }),
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['get', 'libraries'], exact: true });
    },
    onError: (reason) => {
      enqueueSnack({ type: 'error', message: `${reason.code} ${reason.message}` });
    },
  });

  return { mutateAsync, status };
};

/**
 * Request to clean a Library (delete all items from a Library but not the Library itself)
 * [PATCH] /api/v1/libraries/{id}
 */
export const useLibraryCleanupRequest = () => {
  const { t } = useTranslation();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['patch', 'libraries'],
    mutationFn: async ({ id }: LibraryId): Promise<PatchLibraryResponse> => {
      return await createFetch({
        url: bindPathParams(libraryEndpoint, { id }),
        method: 'PATCH',
      });
    },
    onSuccess: (response) => {
      const { title } = response.data;
      const { items_affected: itemsAffected } = response.meta;
      enqueueSnack({
        type: 'info',
        message: t('notifications.libraryCleaned', { title, count: itemsAffected }),
      });
    },
    onError: (reason) => {
      enqueueSnack({ type: 'error', message: `${reason.code} ${reason.message}` });
    },
  });

  return { mutateAsync, status };
};
