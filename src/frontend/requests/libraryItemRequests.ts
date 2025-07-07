import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { bindPathParams } from '../core';
import { createFetch } from '../core';
import { enqueueSnack } from '../core/actions';
import { libraryItemEndpoint, libraryItemsEndpoint } from '../core/links';
import { useSelectedLibraryStore } from '../store/library/useLibrariesStore';
import { useLibraryTableStore } from '../store/library/useLibraryTableStore';

import type { GetLibraryItemsResponse, LibraryItemFormData, LibraryItemResponse } from '../core/types';

interface LibraryId {
  id: number;
}

interface ItemId {
  item: number;
}

interface ItemData {
  data: LibraryItemFormData;
}

/**
 * Request to get items from a specific library
 * [GET] /api/v1/libraries/{id}/items
 * WIP
 * todo: add sorting and pagination query params
 */
export const useLibraryAllItemsGetRequest = () => {
  const selectedLibraryId = useSelectedLibraryStore((state) => state.getSelectedLibrary()?.id);
  const setRows = useLibraryTableStore((state) => state.setRows);

  const { refetch, status, data, error } = useQuery({
    enabled: !!selectedLibraryId,
    queryKey: ['get', 'libraries', selectedLibraryId, 'items'],
    queryFn: (): Promise<GetLibraryItemsResponse> => {
      return createFetch({
        url: bindPathParams(libraryItemsEndpoint, { id: selectedLibraryId as number }),
        method: 'GET',
        cache: 'no-cache',
      });
    },
  });

  useEffect(() => {
    switch (status) {
      case 'success':
        setRows(data.items);
        break;
      case 'error':
        setRows([]);
        enqueueSnack({ message: error.message, type: 'error' });
        break;
    }
  }, [data, error?.message, status, setRows]);

  return { refetch, status, data, error };
};

/**
 * Request to get a specific item from a specific library
 * [GET] /api/v1/libraries/{id}/items/{item}
 *
 * Yes, it is in useMutation hook. because it is called dynamically and mutates the form data.
 */
export const useLibraryItemGetRequest = () => {
  const { mutateAsync, status } = useMutation({
    mutationKey: ['get', 'libraries', 'items'],
    mutationFn: ({ id, item }: LibraryId & ItemId): Promise<LibraryItemResponse> => {
      return createFetch({
        url: bindPathParams(libraryItemEndpoint, { id, item }),
        method: 'GET',
      });
    },
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: 'error' });
    },
  });

  return { mutateAsync, status };
};

/**
 * Request to create a new Item into a specific Library
 * [POST] /api/v1/libraries/{id}/items
 * WIP
 */
export const useLibraryItemPostRequest = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['post', 'libraries', 'items'],
    mutationFn: async ({ id, data }: LibraryId & ItemData): Promise<LibraryItemResponse> => {
      return await createFetch({
        url: bindPathParams(libraryItemsEndpoint, { id }),
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['get', 'libraries', variables.id, 'items'], exact: true });
      const title = Object.values(response.item)[1];
      enqueueSnack({ message: t('notifications.libraryItemCreated', { title }), type: 'success' });
    },
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: 'error' });
    },
  });

  return { mutateAsync, status };
};

/**
 * Request to update a specific Item in a specific Library
 * [PUT] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemPutRequest = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['put', 'libraries', 'items'],
    mutationFn: async ({ id, item, data }: LibraryId & ItemId & ItemData): Promise<LibraryItemResponse> => {
      return await createFetch({
        url: bindPathParams(libraryItemEndpoint, { id, item }),
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['get', 'libraries', variables.id, 'items'], exact: true });
      const title = Object.values(response.item)[1];
      enqueueSnack({ message: t('notifications.libraryItemUpdated', { title }), type: 'success' });
    },
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: 'error' });
    },
  });

  return { mutateAsync, status };
};

/**
 * Request to delete a specific Item from a specific Library
 * [DELETE] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemDeleteRequest = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, status } = useMutation({
    mutationKey: ['delete', 'libraries', 'items'],
    mutationFn: async ({ id, item }: LibraryId & ItemId): Promise<undefined> => {
      return await createFetch({
        url: bindPathParams(libraryItemEndpoint, { id, item }),
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['get', 'libraries', variables.id, 'items'], exact: true });
    },
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: 'error' });
    },
  });

  return { mutateAsync, status };
};
