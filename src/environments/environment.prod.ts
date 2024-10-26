import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  defaultPhotoUrl: 'assets/images/user/avatar-2.jpg',
  messageDisplayDurationInMs: 20000,

  // central authentication service
  cas: 'https://cas-server.azurewebsites.net',
  // identity and access control service
  ics: 'https://ics-server.azurewebsites.net',
  // account management web client
  amwc: 'https://account-manager-eta.vercel.app',

  authorities: {
    access_client: 'acwc.perm.access_client'
  }
};
