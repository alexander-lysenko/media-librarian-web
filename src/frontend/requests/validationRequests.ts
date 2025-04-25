import { useTranslation } from "react-i18next";

import { createHttpRequestHook } from "../core";
import { validateEmailEndpoint, validateItemNameEndpoint, validateLibraryNameEndpoint } from "../core/links";
import { useLibraryCreateFormStore } from "../store/useLibraryCreateFormStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";
import { useSignupFormStore } from "../store/useSignupFormStore";

import type { ErrorResponse, HttpResponseEvents, UseRequestReturn } from "../core/types";

interface EmailRequest {
  email: string;
}

interface LibraryRequest {
  title: string;
}

interface LibraryItemRequest {
  title: string;
  item: number | null;
}

type ResponseMessage = string | boolean;

/**
 * Request to validate the
 * [POST] /api/v1/validations/
 */
export const useEmailValidationRequest = (): UseRequestReturn<EmailRequest, ResponseMessage> => {
  const { t } = useTranslation();
  const setCheckingState = useSignupFormStore((state) => state.setEmailUniqueProcessing);

  const responseEvents: HttpResponseEvents<ResponseMessage> = {
    beforeSend: () => setCheckingState(true),
    onSuccess: () => false,
    onError: (reason: ErrorResponse) => {
      return reason.code === "422" ? reason.message : t("app.internalServerError");
    },
    onComplete: () => setCheckingState(false),
  };

  return createHttpRequestHook<EmailRequest, ResponseMessage>({
    method: "POST",
    endpoint: validateEmailEndpoint,
    customEvents: responseEvents,
    withCredentials: false,
  })();
};

/**
 * Request to validate the Library title uniqueness.
 * [POST] /api/v1/validations/libraries
 */
export const useLibraryTitleValidationRequest = (): UseRequestReturn<LibraryRequest, ResponseMessage> => {
  const { t } = useTranslation();
  const setCheckingState = useLibraryCreateFormStore((state) => state.setTitleUniqueProcessing);

  const responseEvents: HttpResponseEvents<ResponseMessage> = {
    beforeSend: () => setCheckingState(true),
    onSuccess: () => false,
    onError: (reason: ErrorResponse) => {
      return reason.code === "422" ? reason.message : t("app.internalServerError");
    },
    onComplete: () => setCheckingState(false),
  };

  return createHttpRequestHook<LibraryRequest, ResponseMessage>({
    method: "POST",
    endpoint: validateLibraryNameEndpoint,
    customEvents: responseEvents,
    withCredentials: true,
  })();
};

/**
 * Request to validate the Library Item title uniqueness.
 * [POST] /api/v1/validations/libraries/{id}/items
 */
export const useItemTitleValidationRequest = (): UseRequestReturn<LibraryItemRequest, ResponseMessage> => {
  const { t } = useTranslation();
  const setCheckingState = useLibraryItemFormStore((state) => state.setTitleUniqueProcessing);

  const responseEvents: HttpResponseEvents<ResponseMessage> = {
    beforeSend: () => setCheckingState(true),
    onSuccess: () => false,
    onError: (reason: ErrorResponse) => {
      return reason.code === "422" ? reason.message : t("app.internalServerError");
    },
    onComplete: () => setCheckingState(false),
  };

  return createHttpRequestHook<LibraryItemRequest, ResponseMessage>({
    method: "POST",
    endpoint: validateItemNameEndpoint,
    customEvents: responseEvents,
    withCredentials: true,
  })();
};
