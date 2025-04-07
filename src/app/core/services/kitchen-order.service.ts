import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KitchenOrder } from '../models/kitchen-order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KitchenOrderService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/kitchen-orders`;
  
  constructor(private http: HttpClient) { }

  getAllKitchenOrders(): Observable<KitchenOrder[]> {
    return this.http.get<KitchenOrder[]>(this.apiUrl);
  }

  getKitchenOrdersToday(): Observable<KitchenOrder[]> {
    return this.http.get<KitchenOrder[]>(`${this.apiUrl}/today`);
  }

  getKitchenOrdersByOrderId(orderId: number): Observable<KitchenOrder[]> {
    return this.http.get<KitchenOrder[]>(`${this.apiUrl}/by-order/${orderId}`);
  }

  updateStatusToCooking(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-to-cooking/${id}`, id);
  }

  updateStatusToReady(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-to-ready/${id}`, id);
  }

  updateStatusDone(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-to-done/${id}`, id);
  }

  deleteKitchenOrder(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/delete/${id}`, id);
  }
}
