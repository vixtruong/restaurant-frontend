import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntryRequestDto } from '../dtos/entry-request.dto';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { LoginRequestDto } from '../dtos/login-request.dto';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/auth`;
  constructor(private http: HttpClient, private router: Router) { }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  getUserRole(): string {
    const role = localStorage.getItem('role');
    return role!;
  }
  
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      map((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
              localStorage.setItem('refreshToken', res.refreshToken);
              console.log("authInterceptor");
              console.log(res.accessToken);
              console.log(res.refreshToken);

              if (res.accessToken) {
                const payload = this.decodeJwt(res.accessToken);
      
                const userId = payload?.nameid;
      
                localStorage.setItem('userId', userId);
      
                const decoded: any = jwtDecode(res.accessToken);
                const role = decoded?.role;
      
                localStorage.setItem('role', role);
              }

              return res;
      })
    );
  }

  login(loginRequest: LoginRequestDto) {
    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest);
  }
  
  logout() {
    const token = localStorage.getItem('accessToken');
    let role = '';

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload?.role;
    }
    
    if (role === 'Customer') {
      this.router.navigate(['/404']);
    } else {
      this.router.navigate(['/login']);
    }

    localStorage.clear();
  }

  customerEntry(data: EntryRequestDto) {
    return this.http.post<any>(`${this.apiUrl}/entry`, data);
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      const isNotExpired = decoded.exp * 1000 > Date.now();

      console.log(decoded.role, decoded.exp);
      return isNotExpired;
    } catch (error) {
      console.error('❌ Lỗi khi decode token:', error);
      return false;
    }
  }

  isTokenExpired(token: string): boolean {
    const deocdedToken: any = jwtDecode(token);
    return (deocdedToken.exp * 1000) < Date.now();
  }

  decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }
}