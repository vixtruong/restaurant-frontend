import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor = (): ((req: HttpRequest<unknown>, next: HttpHandlerFn) => any) => {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);

    // Bỏ qua URL login, register, refresh
    if (
      req.url.includes('/login') ||
      req.url.includes('/entry') ||
      req.url.includes('/register') ||
      req.url.includes('/refresh')
    ) {
      return next(req);
    }

    // Nếu đã login, gắn token
    if (authService.isAuthenticated()) {
      const token = authService.getAccessToken();
      if (token) {
        req = addToken(req, token);
      }
    }

    return next(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Gọi refresh token
          return authService.refreshToken().pipe(
            switchMap((accessToken: any) => {
              return next(addToken(req, accessToken));
            }),
            catchError(err => {
              authService.logout();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => err);
      })
    );
  };
};

function addToken(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    }
  });
}
