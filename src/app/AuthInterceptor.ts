import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  const token = authService.getToken();
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const toastrService = inject(ToastrService);

  return next(request).pipe(
    catchError((error) => {
      // Check if the error status is 403
      switch (error.status) {
        case 403:
          if (authService.isAuthenticated()) {
            toastrService.error('Insufficent permission');
          }
          // Optionally redirect to login or another page
          // router.navigate(['/login']); // Uncomment this line if you want to redirect
          break;
        case 401:
          toastrService.error('Unauthorized');
          // Optionally redirect to login or another page
          // router.navigate(['/login']); // Uncomment this line if you want to redirect
          break;
        case 404:
          toastrService.error('Resource not found');
          break;
        case 500:
          toastrService.error('Something went wrong');
          break;
        case 0:
          const serverName = getServerNameByUrl(error.url);
          toastrService.warning(serverName + ' server might be down');
          break;
        default:
          break;
      }
      // Rethrow the error to be handled by other parts of the app
      return throwError(error);
    })
  );
};

function getServerNameByUrl(url: string): string {
  if (url.startsWith(environment.cas)) {
    return 'CAS';
  }
  if (url.startsWith(environment.ics)) {
    return 'ICS';
  }
  return 'Unknown';
}
