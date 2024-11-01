// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'src/types';
import packageInfo from '../../package.json';

export const environment: Environment = {
  appVersion: packageInfo.version,
  production: true,
  defaultPhotoUrl: 'assets/images/user/avatar-2.jpg',
  messageDisplayDurationInMs: 20000,
  apps: [
    { name: 'Central Authentication Service', url: 'https://cas-server.azurewebsites.net', abbreviation: 'CAS' },
    { name: 'Identity and Access Control Service', url: 'http://localhost:8080', abbreviation: 'ICS' }
  ],

  // central authentication service
  cas: 'https://cas-server.azurewebsites.net',
  // cas: 'http://localhost:3001',

  // identity and access control service
  // ics: 'https://ics-server.azurewebsites.net',
  ics: 'http://localhost:8080',

  // wc
  amwc: 'https://account-manager-eta.vercel.app'
  // amwc: 'http://localhost:4200'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
