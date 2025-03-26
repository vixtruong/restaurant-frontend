import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/class/menu-item';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MenuItemService {
  private baseUrl = environment.apiUrl; 
  private apiUrl = `${this.baseUrl}/menu-items/`

  constructor(private http: HttpClient) { }

  getAllMenuItems(): Observable<MenuItem[]> {
    const headers = new Headers();
    let token = "";
    headers.append('Authorization', `Bearer ${token}`);
    return this.http.get<MenuItem[]>(this.apiUrl);
  }
}
