import { RequestSlice } from "../core/types";

export const useLibrariesRequests = () => {
  const getRequest: RequestSlice = {
    status: "IDLE",
    abort: () => false,
    fetch: () => false,
    errorHandler: () => false,
    setErrorHandler: () => false,
  };
  const postRequest: RequestSlice = {
    status: "IDLE",
    abort: () => false,
    fetch: () => false,
    errorHandler: () => false,
    setErrorHandler: () => false,
  };

  return {
    getLibraries: getRequest,
    viewLibrary: false,
    createLibrary: postRequest,
    clearLibrary: false,
    deleteLibrary: false,
  };
};
