import { userSignupEndpoint } from "../core/links";
import { baseApiRequest, BaseApiRequestConfig, BaseApiRequestEvents } from "../core/request/baseApiRequest";

export const postUserSignup = () => {
  const config: BaseApiRequestConfig = {
    url: userSignupEndpoint,
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
