export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// export interface PageRequest {
//   publicName: string;
//   page: number;
//   size: number;
//   sort: string;
// }

export type Environment = {
  appVersion: string;
  production: boolean;
  defaultPhotoUrl: string;
  messageDisplayDurationInMs: number;
  cas: string;
  ics: string;
  amwc: string;
};
