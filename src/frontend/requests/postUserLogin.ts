import { userLoginEndpoint } from "../core/links";
import { baseApiRequest, BaseApiRequestConfig, BaseApiRequestEvents } from "../core/request/baseApiRequest";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  redirectTo: string;
  token: string;
}

export const postUserLogin = () => {
  const config: BaseApiRequestConfig = {
    url: userLoginEndpoint,
    method: "POST",
  };

  const events: BaseApiRequestEvents<LoginResponse> = {
    onSuccess: (response) => {
      console.log(response);
      return response;
    },
  };

  return baseApiRequest<LoginRequest, LoginResponse>(config, events);
};
