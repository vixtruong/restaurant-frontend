import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../../../core/services/order.service';
import { OrderDto } from '../../../../core/dtos/order.dto';
import { Router } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-manage-orders',
  imports: [CommonModule, FormsModule, SelectModule, TableModule, ConfirmDialogModule, ToastModule, ButtonModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.css'
})

export class ManageOrdersComponent {
  orderService = inject(OrderService);
  paymentService = inject(PaymentService);

  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);

  orders: OrderDto[] = [];
  filterOrders: OrderDto[] = [];

  @ViewChild('dt2', { static: false }) dt2!: Table;

  stateOptions = ['Tất cả','Hôm nay', 'Hôm qua'];

  ngOnInit() {
    this.orderService.getAllOrders().subscribe({
      next: data => {
        this.orders = data.map(item => new OrderDto(item)).sort((a, b) => {
          if (a.status === 'Unpaid' && b.status !== 'Unpaid') return -1;
          if (a.status !== 'Unpaid' && b.status === 'Unpaid') return 1;
          return 0;
        });
        this.filterOrders = this.orders;
        console.log(this.orders);
      }
    });
  }

  onOptionChange(event: any) {
    const value = event.value;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (value === 'Hôm nay') {
      this.filterOrders = this.orders.filter(o => this.isSameDay(o.createdAt, today));
      console.log('today', this.filterOrders);
      return;
    } else if (value === 'Hôm qua') {
      this.filterOrders = this.orders.filter(o => this.isSameDay(o.createdAt, yesterday));
      return;
    }

    this.filterOrders = this.orders;
    console.log('all', this.filterOrders);
  }

  isSameDay(date1: any, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }
}
