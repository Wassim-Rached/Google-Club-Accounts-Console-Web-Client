import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../roles/roles.service';
import { Permission } from '../permissions.service';
import { Page } from 'src/types';

export interface Account {
  id: string;
  email: string;
  photoUrl: string;
  roles?: Role[];
  permissions?: Permission[];
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
    return this.http.get<Account>(`${environment.ics}/api/accounts/me`);
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${environment.ics}/api/accounts/${id}`);
  }
}
