export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const OAUTH2_REDIRECT_URI = `${window.location.origin}/oauth2/redirect`;
export const GOOGLE_AUTH_URL = `${BACKEND_URL}/oauth2/authorize/google?redirect_uri=${OAUTH2_REDIRECT_URI}`;

const CLIENT_ID = '99d12713-4860-4cfc-adf3-1c1f931fdb6c';
const SCOPE = 'files.readwrite offline_access';
export const REDIRECT_URL = `${window.location.origin}/login/microsoft`;
export const MICROSOFT_AUTH_URL = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}&response_type=code&redirect_uri=${REDIRECT_URL}`;
