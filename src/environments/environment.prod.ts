import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  cas: 'https://cas-server.azurewebsites.net',
  ics: 'https://ics-server.azurewebsites.net'
};
