import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account, AccountsService } from '../accounts/accounts.service';

interface AccountCreds {
  email: string;
  password: string;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentAccountSubject = new BehaviorSubject<Account>(null);
  public currentAccount$ = this.currentAccountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private accountsService: AccountsService
  ) {}

  refreshAccount(): void {
    if (this.isAuthenticated()) {
      this.accountsService.getMyAccount().subscribe({
        next: (account: Account) => {
          this.currentAccountSubject.next(account);
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      this.currentAccountSubject.next(null);
    }
  }

  login(accountCreds: AccountCreds): Observable<any> {
    return this.http.post<TokenResponse>(`${environment.cas}/api/token`, accountCreds).pipe(
      map((response) => {
        this.saveToken(response.token);
        this.refreshAccount();
        return response;
      }),
      catchError((error) => {
        console.error(error);
        this.logout();
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentAccountSubject.next(null);
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // cache related methods
  getAuthoritiesCache(accountId: string): Observable<{ [scope: string]: string[] }> {
    return this.http
      .get<{ authorities: { [scope: string]: string[] } }>(`${environment.cas}/api/token/authorities/cache/${accountId}`)
      .pipe(
        map((response) => {
          return response.authorities;
        })
      );
  }

  clearAuthoritiesCache(accountId: string): Observable<void> {
    return this.http.delete<void>(`${environment.cas}/api/token/authorities/cache/${accountId}`);
  }
}
