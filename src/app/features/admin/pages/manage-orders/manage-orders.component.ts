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
import { Payment } from '../../../../core/models/payment.model';

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

  stateOptions = ['Tất cả','Paid', 'Unpaid'];

  ngOnInit() {
    this.orderService.getAllOrders().subscribe({
      next: data => {
        this.orders = data.map(item => new OrderDto(item));
        this.filterOrders = this.orders;
        console.log(this.orders);
      }
    });
  }

  onOptionChange(event: any) {
    const value = event.value;

    if (value === 'Tất cả') {
      this.filterOrders = this.orders
      return;
    }

    this.filterOrders = this.orders.filter(o => o.status === value);
  }

  confirmCreateBill(order: OrderDto, customerName: string) {
    this.confirmationService.confirm({
      message: `Are you sure to create transaction for ${customerName}?`,
      header: 'Confirm create transaction',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Create',
      rejectLabel: 'Cancle',
      acceptButtonStyleClass: 'p-button-info',
      accept: () => {
        this.createBill(order);
      }
    });
  }

  createBill(order: OrderDto) {
    // const payment = new Payment({
    //   orderId: order.id,
    //   userId: order.customerId,
    //   amount: order.totalPrice,
    //   status: "Paid",
    // });

    // this.paymentService.createPayment(payment).subscribe({
    //   next: data => {
    //     console.log(data);
    //   },
    //   error: err => console.log(err),
    //   complete: () => console.log('Create payment complete')
    // });

    this.router.navigate(['/admin/invoice', order.id]);
  }
}
