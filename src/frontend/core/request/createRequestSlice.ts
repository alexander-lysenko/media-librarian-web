export interface CreateRequest<Request = void, Response = void> {
  status: "IDLE" | "LOADING" | "SUCCESS" | "FAILED";
}

export const createRequestSlice = (set, get, title: string):
  CreateRequest<Request, Response> => ({
  [title]: {
    status: "IDLE",
    fetch: () => true,
  }
});
