import { librariesUrl, userSignupUrl } from "../core/links";
import { baseApiRequest, BaseApiRequestConfig, BaseApiRequestEvents } from "../core/request/baseApiRequest";

export const getLibraries = () => {
  const config: BaseApiRequestConfig = {
    url: librariesUrl,
    method: "POST",
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
