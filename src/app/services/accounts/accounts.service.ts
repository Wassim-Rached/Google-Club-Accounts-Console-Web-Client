import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Account {
  _id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private http: HttpClient) {}

  getMyAccount(): Observable<any> {
    return this.http.get<any>(`${environment.ics}/api/accounts/me`);
  }

  getAccounts(): Observable<any> {
    return this.http.get<any>(`${environment.ics}/api/accounts`);
  }
}
