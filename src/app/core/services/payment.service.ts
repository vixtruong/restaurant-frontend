import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentDto } from '../dtos/payment.dto';
import { environment } from '../../../environments/environment';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/payments`

  constructor(private http: HttpClient) { }

  getAllPayments(): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}`);
  }

  getPaymentsToday(): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}/today`);
  }

  getPaymentsFromTo(from: string, to: string): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}/from-to?from=${from}&to=${to}`);
  }

  getPaymentsByMonthYear(month: number, year: number): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}/month-year?month=${month}&year=${year}`);
  }

  createPayment(payment: Payment): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, payment);
  }
}
