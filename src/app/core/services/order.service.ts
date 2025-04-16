import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';
import { OrderItemDto } from '../dtos/order-item.dto';
import { OrderRequestDto } from '../dtos/order-request.dto';
import { OrderItem } from '../models/order-item.model';
import { OrderDto } from '../dtos/order.dto';
import { OrderDetailDto } from '../dtos/order-detail.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/orders`

  private cartService = inject(CartService);

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrl);
  }

  getOrderDetail(orderId: number): Observable<OrderDetailDto> {
    return this.http.get<OrderDetailDto>(`${this.apiUrl}/detail/${orderId}`);
  }

  gerNumberOfOrdersInMonth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/number-orders-month`);
  }

  gerNumberOfOrdersToday(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/number-orders-today`);
  }

  createOrder(): Observable<any> {
    const orderId = localStorage.getItem('orderId');
    const userId = localStorage.getItem('userId');
    const tableNumber = localStorage.getItem('tableNumber');

    const cartData: OrderItem[] = this.cartService.getCart();
    const unconfirmedItems = cartData.filter(item => !item.confirmed);

    let orderItemDtos: OrderItemDto[] = unconfirmedItems.map(i => ({
      menuItemId: i.id,
      quantity: i.quantity
    }));

    if (orderItemDtos.length > 0 && userId && tableNumber) {
      const orderRequest = new OrderRequestDto({
        customerId: parseInt(userId),
        tableNumber: parseInt(tableNumber),
        items: orderItemDtos,
        orderId: orderId ? parseInt(orderId) : undefined
      });
    
      return this.http.post<any>(`${this.apiUrl}/create`, orderRequest).pipe(
        tap(() => {
          const updatedCart = cartData.map(item => {
            const isConfirmedNow = unconfirmedItems.some(un => un.id === item.id);
            return new OrderItem({ ...item, confirmed: isConfirmedNow ? true : item.confirmed });
          });
      
          this.cartService.saveCart(updatedCart);
        })
      );
      
    } else {
      console.warn('⚠️ Không có item nào mới cần gửi');
      return EMPTY;
    }
  }

  handleEmptyOrderId(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/handle-empty/${orderId}`, orderId);
  }
}
