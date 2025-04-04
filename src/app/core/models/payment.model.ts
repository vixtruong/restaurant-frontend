export class Payment {
  readonly id: number;
  orderId: number;
  userId: number;
  paymentMethod: string;
  amount: number;
  status?: string;
  PaidAt: Date;

  constructor(data: Partial<Payment>) {
    this.id = data.id ?? 0,
    this.orderId = data.orderId ?? 0,
    this.userId = data.userId ?? 0,
    this.paymentMethod = data.paymentMethod ?? "Cash";
    this.amount = data.amount ?? 0,
    this.PaidAt = data.PaidAt ?? new Date();
  }
}