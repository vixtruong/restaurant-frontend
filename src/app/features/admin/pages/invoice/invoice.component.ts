import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { OrderService } from '../../../../core/services/order.service';
import { OrderDetailDto } from '../../../../core/dtos/order-detail.dto';

import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [FormsModule, CommonModule, TableModule, ButtonModule],
  providers: [DatePipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  orderService = inject(OrderService);
  route = inject(ActivatedRoute);
  datePipe = inject(DatePipe);

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
    window.print();
  }  
}
