import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getAccessToken();

  // Nếu không có token → redirect luôn
  if (!token) {
    router.navigate(['/entry']);
    return of(false);
  }

  const isExpired = auth.isTokenExpired(token);

  if (!isExpired && auth.isAuthenticated()) {
    return of(true);
  }

  // Nếu token hết hạn → thử refresh
  return auth.refreshToken().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/entry']);
      return of(false);
    })
  );
};
