import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  // Check if token there
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        // Token expired then log out
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return throwError(() => new Error('Token expired'));
      }

      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('token');
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    } catch (e) {
      // Invalid token format
      localStorage.removeItem('token');
      router.navigate(['/login']);
      return throwError(() => new Error('Invalid token'));
    }
  }

  return next(req);
};
