import { useMutation } from "@tanstack/react-query";

import { bindPathParams, createFetch } from "../core";
import { validateEmailEndpoint, validateItemNameEndpoint, validateLibraryNameEndpoint } from "../core/links";
import { useSelectedLibraryStore } from "../store/library/useLibrariesStore";
import { useLibraryCreateFormStore } from "../store/useLibraryCreateFormStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";
import { useSignupFormStore } from "../store/useSignupFormStore";

import type { ErrorResponse } from "../core/types";

interface EmailRequest {
  email: string;
}

interface LibraryRequest {
  title: string;
}

interface LibraryItemRequest {
  title: string;
  item?: number;
}

type ValidationResponse = undefined | ErrorResponse;

/**
 * Request to validate the email uniqueness during a user signup process or changing the email address in profile.
 * [POST] /api/v1/validations/email
 */
export const useEmailValidationRequest = () => {
  const setCheckingState = useSignupFormStore((state) => state.setEmailUniqueProcessing);

  const { mutateAsync } = useMutation({
    mutationKey: ["validations", "email"],
    mutationFn: (data: EmailRequest): Promise<ValidationResponse> =>
      createFetch({ url: validateEmailEndpoint, method: "POST", body: JSON.stringify(data), credentials: "omit" }),
    onMutate: () => setCheckingState(true),
    onSettled: () => setCheckingState(false),
  });

  return { mutateAsync };
};

/**
 * Request to validate the Library title uniqueness when creating a new Library.
 * [POST] /api/v1/validations/libraries
 */
export const useLibraryTitleValidationRequest = () => {
  const setCheckingState = useLibraryCreateFormStore((state) => state.setTitleUniqueProcessing);

  const { mutateAsync } = useMutation({
    mutationKey: ["validations", "libraries", "title"],
    mutationFn: (data: LibraryRequest): Promise<ValidationResponse> => {
      return createFetch({ url: validateLibraryNameEndpoint, method: "POST", body: JSON.stringify(data) });
    },
    onMutate: () => setCheckingState(true),
    onSettled: () => setCheckingState(false),
  });

  return { mutateAsync };
};

/**
 * Request to validate the Library Item title uniqueness when creating a new Library Item or updating an existing one.
 * [POST] /api/v1/validations/libraries/{id}/items
 */
export const useItemTitleValidationRequest = () => {
  const setCheckingState = useLibraryItemFormStore((state) => state.setTitleUniqueProcessing);
  const selectedLibraryId = useSelectedLibraryStore((state) => state.getSelectedLibrary()?.id);

  const { mutateAsync } = useMutation({
    mutationKey: ["validations", "libraries", "items", "title"],
    mutationFn: (data: LibraryItemRequest): Promise<ValidationResponse> => {
      const url = bindPathParams(validateItemNameEndpoint, { id: selectedLibraryId as number });

      return createFetch({ url, method: "POST", body: JSON.stringify(data) });
    },
    onMutate: () => setCheckingState(true),
    onSettled: () => setCheckingState(false),
  });

  return { mutateAsync };
};
