import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/class/menu-item.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MenuItemService {
  private baseUrl = environment.baseUrl; 
  private apiUrl = `${this.baseUrl}/menu-items/`

  constructor(private http: HttpClient) { }

  getAllMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }
}
