import { DatePipe } from '@angular/common';

export class PaymentDto {
  readonly id: number;
  orderId: number;
  userId: number;
  userName: string;
  paymentMethod: string;
  amount: number;
  status?: string;
  paidAt: Date;

  constructor(data: Partial<PaymentDto>) {
    this.id = data.id ?? 0,
    this.orderId = data.orderId ?? 0,
    this.userId = data.userId ?? 0,
    this.userName = data.userName ?? "",
    this.paymentMethod = data.paymentMethod ?? "Cash";
    this.amount = data.amount ?? 0,
    this.status = data.status ?? "Unpaid",
    this.paidAt = data.paidAt ? new Date(data.paidAt) : new Date();

  }

  getFormatDate(): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(this.paidAt, 'dd/MM/yyyy HH:mm') ?? "";
  }

  static getPaymentInfo(payment: PaymentDto) {
    return {
      id: payment.id,
      userName: payment.userName,
      paymentMethod: payment.paymentMethod,
      amount: payment.amount,
      status: payment.status,
      paidAt: payment.getFormatDate()
    };
  }
}