export const apiDomain = import.meta.env.VITE_APP_URL;

export const userSignupEndpoint = '/api/v1/user/signup';
export const userLoginEndpoint = '/api/v1/user/login';
export const userPasswordResetEndpoint = '/api/v1/user/password-reset';

export const profileEndpoint = '/api/v1/profile';
export const changePasswordEndpoint = '/api/v1/profile/password';

export const librariesEndpoint = '/api/v1/libraries';
export const libraryEndpoint = '/api/v1/libraries/{id}';
export const libraryItemsEndpoint = '/api/v1/libraries/{id}/items';
export const libraryItemEndpoint = '/api/v1/libraries/{id}/items/{item}';

export const unsplashRandomImageEndpoint = '/api/unsplash/random';
export const unsplashExactImageEndpoint = '/api/unsplash/image/{id}';

export const validateEmailEndpoint = '/api/v1/validations/email';
export const validateLibraryNameEndpoint = '/api/v1/validations/libraries';
export const validateItemNameEndpoint = '/api/v1/validations/libraries/{id}/items';
