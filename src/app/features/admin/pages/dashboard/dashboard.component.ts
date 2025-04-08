import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from 'chart.js';

import { OrderService } from '../../../../core/services/order.service';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentDto } from '../../../../core/dtos/payment.dto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  orderService = inject(OrderService);
  paymentService = inject(PaymentService);

  thisMonthPayments: PaymentDto[] = [];
  previousMonthPayments: PaymentDto[] = [];
  numberOrdersInMonth: number = 0;
  numberOrdersToday: number = 0;

  todayRevenue: number = 0;
  monthRevenue: number = 0;

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  thisMonthDays: number[] = [];
  thisMonthAmounts: number[] = [];
  previousMonthDays: number[] = [];
  previousMonthAmounts: number[] = [];

  chartThisMonthData?: ChartData<'bar'>;
  chartPreviousMonthData?: ChartData<'bar'>;
  chartOptions: ChartOptions = {
    responsive: true,
  };

  ngOnInit() {
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    this.orderService.gerNumberOfOrdersInMonth().subscribe({
      next: data => this.numberOrdersInMonth = parseInt(data),
      error: err => console.log(err)
    });

    this.orderService.gerNumberOfOrdersToday().subscribe({
      next: data => this.numberOrdersToday = parseInt(data),
      error: err => console.log(err)
    });

    this.getDaysInMonth(this.month, this.year);

    // Gọi lần lượt hai request rồi xử lý sau khi cả hai đã hoàn tất
    this.paymentService.getPaymentsByMonthYear(this.month, this.year).subscribe({
      next: data => {
        this.thisMonthPayments = data.map(item => new PaymentDto(item));
        this.monthRevenue = 0;
        this.todayRevenue = 0;
        const today = new Date();

        this.thisMonthPayments.forEach(payment => {
          this.monthRevenue += payment.amount;

          const paidDate = new Date(payment.paidAt);
          if (
            paidDate.getDate() === today.getDate() &&
            paidDate.getMonth() === today.getMonth() &&
            paidDate.getFullYear() === today.getFullYear()
          ) {
            this.todayRevenue += payment.amount;
          }
        });

        // Gọi tiếp API tháng trước sau khi xong tháng hiện tại
        this.paymentService.getPaymentsByMonthYear(this.month - 1, this.year).subscribe({
          next: data => {
            this.previousMonthPayments = data.map(item => new PaymentDto(item));

            // Sau khi có đủ dữ liệu, thực hiện tính toán và vẽ chart
            this.calculateRevenueByDay();

            this.chartThisMonthData = {
              labels: this.thisMonthDays,
              datasets: [{
                data: this.thisMonthAmounts,
                label: 'This Month Revenue',
                backgroundColor: '#42A5F5'
              }]
            };

            this.chartPreviousMonthData = {
              labels: this.previousMonthDays,
              datasets: [{
                data: this.previousMonthAmounts,
                label: 'Previous Month Revenue',
                backgroundColor: '#9CCC65'
              }]
            };
          }
        });
      }
    });
  }

  getDaysInMonth(month: number, year: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    this.thisMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const daysInPreviousMonth = new Date(year, month - 1, 0).getDate();
    this.previousMonthDays = Array.from({ length: daysInPreviousMonth }, (_, i) => i + 1);
  }

  calculateRevenueByDay() {
    this.thisMonthAmounts = Array(this.thisMonthDays.length).fill(0);
    this.thisMonthPayments.forEach(payment => {
      const paymentDate = new Date(payment.paidAt);
      const day = paymentDate.getDate();
      const index = this.thisMonthDays.indexOf(day);
      if (index !== -1) {
        this.thisMonthAmounts[index] += payment.amount;
      }
    });

    this.previousMonthAmounts = Array(this.previousMonthDays.length).fill(0);
    this.previousMonthPayments.forEach(payment => {
      const paymentDate = new Date(payment.paidAt);
      const day = paymentDate.getDate();
      const index = this.previousMonthDays.indexOf(day);
      if (index !== -1) {
        this.previousMonthAmounts[index] += payment.amount;
      }
    });
  }
}
