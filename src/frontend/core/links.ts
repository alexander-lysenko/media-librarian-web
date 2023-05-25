export const apiDomain = import.meta.env.VITE_APP_URL;

export const userSignupEndpoint = apiDomain + "/api/v1/user/signup";
export const userLoginEndpoint = apiDomain + "/api/v1/user/login";

export const profileEndpoint = apiDomain + "/api/v1/profile";

export const librariesEndpoint = apiDomain + "/api/v1/libraries";
export const libraryItemsEndpoint = apiDomain + "/api/v1/libraries/{id}/items";
