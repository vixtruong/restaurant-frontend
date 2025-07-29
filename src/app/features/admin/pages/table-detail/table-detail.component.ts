import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { OrderDetailDto } from '../../../../core/dtos/order-detail.dto';

import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table-detail',
  imports: [CommonModule, TableModule],
  templateUrl: './table-detail.component.html',
  styleUrl: './table-detail.component.css'
})
export class TableDetailComponent {
  orderService = inject(OrderService);
  route = inject(ActivatedRoute);

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
}
