import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { OrderService } from '../../../../core/services/order.service';
import { Table } from '../../../../core/models/table.model';
import { TableDto } from '../../../../core/dtos/table.dto';

@Component({
  selector: 'app-manage-table',
  imports: [CommonModule, CardModule],
  templateUrl: './manage-table.component.html',
  styleUrl: './manage-table.component.css'
})
export class ManageTableComponent {
  orderService = inject(OrderService);

  tables: TableDto[] = [];
  unavailableTables: TableDto[] = [];
  availableTables: TableDto[] = [];

  ngOnInit() {
    this.orderService.getAllTables().subscribe({
      next: data => {

        console.log(data);
        this.tables = data.map(item => new TableDto(item));

        this.availableTables = this.tables.filter(t => t.available);

        this.unavailableTables = this.tables.filter(t => t.available === false);

        console.log(this.availableTables);
        console.log(this.unavailableTables);
      },
      error: err => {

      }
    });
  }
}
