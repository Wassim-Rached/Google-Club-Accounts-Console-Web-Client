import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  const token = authService.getToken();
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error) => {
      // Check if the error status is 403
      switch (error.status) {
        case 403:
          // check if the request is not the login request
          if (request.url !== `${environment.cas}/api/token`) {
            toastrService.error('Insufficent permission');
          }
          break;
        case 401:
          // check if the request is not the login request
          if (request.url !== `${environment.cas}/api/token`) {
            toastrService.error('Unauthorized');
          }
          break;
        case 404:
          toastrService.error('Resource not found');
          break;
        case 500:
          toastrService.error('Something went wrong');
          break;
        default:
          toastrService.warning('Servers might be down');
          break;
      }
      // Rethrow the error to be handled by other parts of the app
      return throwError(error);
    })
  );
};
