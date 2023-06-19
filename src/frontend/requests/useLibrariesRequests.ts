export const useLibrariesRequests = () => {
  const getRequest = {
    status: "IDLE",
    abort: () => false,
    fetch: () => false,
    errorHandler: () => false,
    setErrorHandler: () => false,
  };
  const postRequest = {
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
