import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntryRequest } from '../models/class/entry-request';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/auth`
  constructor(private http: HttpClient) { }

  entry(data: EntryRequest): Observable<any> {
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