import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/users`;

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/employees`);
  }

  getAllCustomers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/customers`);
  }

  addEmployees(employee: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add`, employee);
  }

  deleteEmployees(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
