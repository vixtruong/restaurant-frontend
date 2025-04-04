import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Table, TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentDto } from '../../../../core/dtos/payment.dto';

@Component({
  selector: 'app-revenue',
  imports: [FormsModule, TableModule, ButtonModule, FloatLabelModule, DatePickerModule, SelectModule],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css'
})

export class RevenueComponent {
  paymentService = inject(PaymentService);

  @ViewChild('dt2', { static: false }) dt2!: Table;

  payments: PaymentDto[] = [];
  filterPayments: PaymentDto[] = [];

  options = ['Tất cả', 'Hôm nay', 'Hôm qua'];
  selectedOption = 'Tất cả';

  ngOnInit() {
    this.paymentService.getAllPayments().subscribe({
      next: data => {
        this.payments = data.map(item => new PaymentDto(item));
        this.filterPayments = this.payments;
      }
    });
  }

  onSelectChange() {
    const today = new Date();  // Lấy ngày hiện tại
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (this.selectedOption === 'Hôm nay') {
      this.filterPayments = this.payments.filter(p => this.isSameDay(p.paidAt, today));
    } else if (this.selectedOption === 'Hôm qua') {
      this.filterPayments = this.payments.filter(p => this.isSameDay(p.paidAt, yesterday));
    } else {
      this.filterPayments = this.payments;
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
}