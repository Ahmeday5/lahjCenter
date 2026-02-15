import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ تجاهل login request
  if (req.url.includes('/login')) {
    return next(req);
  }

  // ✅ فحص انتهاء التوكن لباقي الريكوستات
  if (authService.isTokenExpired() && router.url !== '/login') {
    authService.logout();
    router.navigate(['/login']);
    return EMPTY;
  }

  const token = authService.getToken();

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && router.url !== '/login') {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
