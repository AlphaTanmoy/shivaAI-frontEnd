const shouldCallBackendServer = true;

export const environment = {
  production: true,
  shouldCallBackendServer,
  apiUrl: shouldCallBackendServer
    ? 'https://shivaai-backend.tanmoysyatraofficial.store'
    : 'http://localhost:9669',
};