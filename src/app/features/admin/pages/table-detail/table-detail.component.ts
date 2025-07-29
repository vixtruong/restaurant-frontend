import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { OrderDetailDto } from '../../../../core/dtos/order-detail.dto';

import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-table-detail',
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './table-detail.component.html',
  styleUrl: './table-detail.component.css'
})
export class TableDetailComponent {
  orderService = inject(OrderService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  confirmationService = inject(ConfirmationService);

  tableNumber?: number;
  orderDetail?: OrderDetailDto;

  ngOnInit() {
    this.tableNumber = Number(this.route.snapshot.paramMap.get('tableId'));
    const orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));

    this.orderService.getOrderDetail(orderId).subscribe({
      next: data => {
        if (data.tableNumber === this.tableNumber) {
          this.orderDetail = data;
        }
      
        console.log(this.orderDetail);
      },
      error: err => console.log(err),
      complete: () => console.log('Load order detail complete.')
    });
  }

  confirmCreateBill() {
    this.confirmationService.confirm({
      message: `Are you sure to create transaction for ${this.orderDetail?.customerName}?`,
      header: 'Confirm create transaction',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Create',
      rejectLabel: 'Cancle',
      acceptButtonStyleClass: 'p-button-info',
      accept: () => {
        this.createBill(this.orderDetail?.orderId!);
      }
    });
  }

  createBill(orderId: Number) {
    this.router.navigate(['/admin/invoice', orderId]);
  }
}
