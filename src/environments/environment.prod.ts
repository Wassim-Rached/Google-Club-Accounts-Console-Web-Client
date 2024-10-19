import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  cas: 'https://cas-server.azurewebsites.net',
  ics: 'https://ics-server.azurewebsites.net',
  amwc: 'https://account-manager-eta.vercel.app',
  defaultPhotoUrl: 'assets/images/user/avatar-2.jpg'
};
