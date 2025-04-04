import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { OrderService } from '../../../../core/services/order.service';
import { OrderDetailDto } from '../../../../core/dtos/order-detail.dto';

import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Payment } from '../../../../core/models/payment.model';
import { PaymentService } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-invoice',
  imports: [FormsModule, CommonModule, TableModule, ButtonModule, ToastModule],
  providers: [DatePipe, MessageService],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})

export class InvoiceComponent {
  orderService = inject(OrderService);
  paymentService = inject(PaymentService);

  route = inject(ActivatedRoute);
  datePipe = inject(DatePipe);
  messageService = inject(MessageService);

  orderDetail?: OrderDetailDto;

  today = this.datePipe.transform(Date.now(), 'dd/MM/yyyy HH:mm');
  subTotal?: number;
  total?: number;

  ngOnInit() {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    this.orderService.getOrderDetail(orderId).subscribe({
      next: data => {
        this.orderDetail = data;
        let subtotal = 0;

        this.orderDetail.orderItems.forEach(item => {
          subtotal += item.price;
        });

        this.subTotal = subtotal;
        this.total = subtotal + subtotal * 0.1;
        console.log(this.orderDetail);
      },
      error: err => console.log(err),
      complete: () => console.log('Load order detail complete.')
    });
  }

  printInvoice() {
    window.onafterprint = () => {
      console.log("Print dialog closed");
  
      const payment = new Payment({
        orderId: this.orderDetail?.orderId,
        userId: this.orderDetail?.customerId,
        amount: this.total,
        status: "Paid",
      });
  
      this.paymentService.createPayment(payment).subscribe({
        next: data => {
          console.log(data);
          setTimeout(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Create successfully.',
              detail: `Invoice has been created successfully!`,
              life: 3000
            });
          }, 3000);
        },
        error: err => console.log(err),
        complete: () => console.log('Create payment complete')
      });
    };
  
    window.print();
  }
  
}
