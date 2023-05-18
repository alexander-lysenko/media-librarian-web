export const apiDomain = import.meta.env.VITE_APP_URL;

export const userSignupUrl = apiDomain + "/api/v1/user/signup";
export const userLoginUrl = apiDomain + "/api/v1/user/login";

export const librariesUrl = apiDomain + "/api/v1/libraries";
export const libraryItemsUrl = apiDomain + "/api/v1/libraries/{id}/items";
