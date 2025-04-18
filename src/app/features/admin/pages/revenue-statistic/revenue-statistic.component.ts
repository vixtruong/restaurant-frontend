import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentDto } from '../../../../core/dtos/payment.dto';
import { ChartModule } from 'primeng/chart';

import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-revenue-statistic',
  imports: [FormsModule, FloatLabelModule, SelectModule, ChartModule],
  templateUrl: './revenue-statistic.component.html',
  styleUrl: './revenue-statistic.component.css'
})

export class RevenueStatisticComponent {
  paymentService = inject(PaymentService);

  payments: PaymentDto[] = []; 

  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years = [2023, 2024, 2025, 2026, 2027];

  selectMonth = new Date(Date.now()).getMonth() + 1;
  selectYear = new Date(Date.now()).getFullYear();

  chartData?: ChartData<'bar'>;
  chartOptions: ChartOptions = {
    responsive: true,
  };

  days: number[] = [];
  amounts: number[] = [];

  ngOnInit() {
    this.showChart(this.selectMonth, this.selectYear);
  }

  onChange(month: number, year: number) {
    this.showChart(month, year);
  }

  showChart(month: number, year: number) {
    this.getDaysInMonth(month, year);
    this.paymentService.getPaymentsByMonthYear(month, year).subscribe({
      next: data => {
        this.payments = data.map(item => new PaymentDto(item));

        this.calculateRevenueByDay();

        this.chartData = {
          labels: this.days,
          datasets: [{
            data: this.amounts,
            label: 'Revenue',
            backgroundColor: '#42A5F5'
          }]
        };
      }
    });
  }

  getDaysInMonth(month: number, year: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  calculateRevenueByDay() {
    // Khởi tạo mảng amounts với giá trị ban đầu là 0 cho từng ngày
    this.amounts = Array(this.days.length).fill(0);

    // Duyệt qua tất cả các thanh toán
    this.payments.forEach(payment => {
      const paymentDate = new Date(payment.paidAt);  // Lấy ngày thanh toán
      const dayOfPayment = paymentDate.getDate();  // Lấy ngày trong tháng từ paidAt

      // Tính tổng doanh thu cho ngày tương ứng
      const dayIndex = this.days.indexOf(dayOfPayment);
      if (dayIndex !== -1) {
        this.amounts[dayIndex] += payment.amount;
      }
    });
  }
}
