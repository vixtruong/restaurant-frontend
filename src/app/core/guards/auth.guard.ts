import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  if (!token) {
    auth.logout();
    return of(false);
  }

  const isExpired = auth.isTokenExpired(token);

  const checkRoleAndReturn = () => {
    const allowedRoles: string[] = route.data['roles'] || [];
    const userRole = auth.getUserRole();

    console.log('ROLE của user:', userRole);
    console.log('ROLE được phép:', allowedRoles);

    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return of(true);
    }

    return of(false);
  };

  if (!isExpired && auth.isAuthenticated()) {
    return checkRoleAndReturn();
  }

  return auth.refreshToken().pipe(
    switchMap(() => checkRoleAndReturn()),
    catchError(() => {
      console.log("guard logout");
      auth.logout();
      return of(false);
    })
  );
};
