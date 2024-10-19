import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../roles/roles.service';
import { Permission } from '../permissions.service';
import { Page } from 'src/types';

export interface AccountEditResponse {
  email: string;
  roles: {
    granted: string[];
    revoked: string[];
  };
  permissions: {
    granted: string[];
    revoked: string[];
  };
}

export interface AccountEditRequest {
  email: string;
  roles: {
    grant: string[];
    revoke: string[];
  };
  permissions: {
    grant: string[];
    revoke: string[];
  };
}

export interface Account {
  id: string;
  email: string;
  photoUrl: string;
  roles?: Role[];
  permissions?: Permission[];
  isEmailVerified: boolean;
  isLocked: boolean;
  isMember: boolean;
  isIdentityVerified: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private http: HttpClient) {}

  searchAccounts(
    page: number = 0,
    size: number = 10,
    sort: string = 'scope',
    direction = 'asc',
    email: string = ''
  ): Observable<Page<Account>> {
    return this.http.get<Page<Account>>(
      `${environment.ics}/api/accounts?page=${page}&size=${size}&sort=${sort}&email=${email}&direction=${direction}`
    );
  }

  getMyAccount(): Observable<Account> {
    return this.http.get<Account>(`${environment.ics}/api/accounts/me`).pipe(
      map((account) => {
        if (!account.photoUrl) {
          account.photoUrl = environment.defaultPhotoUrl;
        }
        return account;
      })
    );
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${environment.ics}/api/accounts/${id}`).pipe(
      map((account) => {
        if (!account.photoUrl) {
          account.photoUrl = environment.defaultPhotoUrl;
        }
        return account;
      })
    );
  }

  editAccount(body: AccountEditRequest): Observable<AccountEditResponse> {
    return this.http
      .post<AccountEditResponse[]>(`${environment.ics}/api/accounts/authorities`, [body])
      .pipe(map((response) => response[0]));
  }
  toggleIdentityVerification(id: string, verify: boolean): Observable<string> {
    return this.http
      .post(`${environment.ics}/api/accounts/${id}/identity-verification?verify=${verify}`, {}, { responseType: 'text' })
      .pipe(map((response) => response as string));
  }

  toggleAccountLock(id: string, lock: boolean): Observable<string> {
    return this.http
      .post(`${environment.ics}/api/accounts/${id}/lock-account?lock=${lock}`, {}, { responseType: 'text' })
      .pipe(map((response) => response as string));
  }

  changeMembership(id: string, member: boolean): Observable<string> {
    return this.http
      .post(`${environment.ics}/api/accounts/${id}/membership?member=${member}`, {}, { responseType: 'text' })
      .pipe(map((response) => response as string));
  }
}
