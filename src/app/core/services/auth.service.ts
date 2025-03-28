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
  
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      map((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        console.log(res.accessToken);
        return res.accessToken;
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  login(loginRequest: LoginRequestDto) {
    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest).subscribe({
      next: res => {
        this.setAccessToken(res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        console.log('✅ Đăng nhập thành công');

        const token = this.getAccessToken();

        if (token) {
          const payload = this.decodeJwt(token);
          const role = payload?.role;

          const userId = payload?.nameid;

          localStorage.setItem('userId', userId);

          localStorage.setItem('role', role);
        }

        // this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.log("Fail log in!", err);
        alert('Đăng nhập thất bại. Vui lòng thử lại!');
      },
      complete: () => console.log('Complete login request')
    });
  }
  
  logout() {
    const token = localStorage.getItem('accessToken');
    let role = '';

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload?.role;
    }
    localStorage.clear();

    if (role === 'Customer') {
      this.router.navigate(['/404']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  customerEntry(data: EntryRequestDto) {
    return this.http.post<any>(`${this.apiUrl}/entry`, data).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        console.log('✅ Đăng nhập thành công');

        const payload = this.decodeJwt(res.accessToken);
        const userId = payload?.nameid;

        localStorage.setItem('userId', userId);

        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Đăng nhập thất bại:', err);
        alert('Đăng nhập thất bại. Vui lòng thử lại!');
      },
      complete: () => {
        console.log('🔁 Hoàn tất xử lý entry request.');
      }
    });
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      const isCustomerRole = decoded.role === "Customer";
      const isNotExpired = decoded.exp * 1000 > Date.now();

      console.log(decoded.role, decoded.exp);
      return isCustomerRole && isNotExpired;
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