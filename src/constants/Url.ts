export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const OAUTH2_REDIRECT_URI = `${window.location.origin}/oauth2/redirect`;
export const GOOGLE_AUTH_URL = `${BACKEND_URL}/oauth2/authorize/google?redirect_uri=${OAUTH2_REDIRECT_URI}`;
