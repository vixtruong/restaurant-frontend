import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/class/menu-item';

@Injectable({
  providedIn: 'root'
})

export class MenuItemService {
  private apiUrl = "https://localhost:5001/api/menu-items/"

  constructor(private http: HttpClient) { }

  getAllMenuItems(): Observable<MenuItem[]> {
    const headers = new Headers();
    let token = "";
    headers.append('Authorization', `Bearer ${token}`);
    return this.http.get<MenuItem[]>(this.apiUrl);
  }
}
