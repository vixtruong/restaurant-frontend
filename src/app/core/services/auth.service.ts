import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntryRequestDto } from '../dtos/entry-request.dto';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/auth`
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
      map(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        return res.accessToken;
      })
    );
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

  customerEntry(data: EntryRequestDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/entry`, data);
  }
  
  isCustomerAuthenticated(): boolean {
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
}