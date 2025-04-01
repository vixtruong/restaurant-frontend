import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MenuItemService {
  private baseUrl = environment.baseUrl; 
  private apiUrl = `${this.baseUrl}/menu-items`

  constructor(private http: HttpClient) { }

  getAllMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }
  
  getMenuItemById(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/${id}`);
  }

  createMenuItem(item: MenuItem): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, item);
  }

  updateMenuItem(id: number, item: MenuItem): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, item);
  }

  updateItemStatus(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-status/${id}`, id);
  }

  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }  
}
