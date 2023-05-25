import { profileEndpoint } from "../core/links";
import { baseApiRequest, BaseApiRequestConfig, BaseApiRequestEvents } from "../core/request/baseApiRequest";

export const getProfile = () => {
  const config: BaseApiRequestConfig = {
    url: profileEndpoint,
    method: "GET",
  };

  const events: BaseApiRequestEvents = {
    onSuccess: (response) => {
      console.log(response);
      return;
    },
    onError: (error) => {
      console.log("errorrrrr:", error);
    },
  };

  return baseApiRequest(config, events);
};
