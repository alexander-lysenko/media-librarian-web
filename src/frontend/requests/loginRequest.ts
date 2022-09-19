import { userLoginUrl } from "../core/links";
import { baseApiRequest, BaseApiRequestConfig, BaseApiRequestEvents } from "../core/request/baseApiRequest";

export const signupRequest = () => {
  const config: BaseApiRequestConfig = {
    url: userLoginUrl,
    method: "POST",
  };

  const events: BaseApiRequestEvents = {
    onSuccess: (response) => {
      console.log(response);
      return;
    },
  };

  return baseApiRequest(config, events);
};
