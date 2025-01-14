import { Environment } from 'src/types';
import packageInfo from '../../package.json';

export const environment: Environment = {
  appVersion: packageInfo.version,
  production: true,
  defaultPhotoUrl: 'assets/images/user/avatar-2.jpg',
  messageDisplayDurationInMs: 20000,
  apps: [
    { name: 'Central Authentication Service', url: 'https://cas-server-2.azurewebsites.net', abbreviation: 'CAS' },
    { name: 'Identity and Access Control Service', url: 'https://ics-server-2.azurewebsites.net', abbreviation: 'ICS' }
  ],

  // central authentication service
  cas: 'https://cas-server-2.azurewebsites.net',
  // identity and access control service
  ics: 'https://ics-server-2.azurewebsites.net',
  // account management web client
  amwc: 'https://account-manager-eta.vercel.app'
};
