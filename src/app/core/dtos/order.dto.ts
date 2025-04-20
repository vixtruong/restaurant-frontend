export class OrderDto {
  readonly id: number;
  customerId: number;
  customerName: string;
  tableNumber:  number;
  status: string;
  totalPrice: number;
  createdAt: Date;
  endAt?: Date;
  paymentRequest?: boolean;

  constructor(data: Partial<OrderDto>) {
    this.id = data.id ?? 0;
    this.customerId = data.customerId ?? 0;
    this.customerName = data.customerName ?? "";
    this.tableNumber = data.tableNumber ?? 0;
    this.status = data.status ?? "";
    this.totalPrice = data.totalPrice ?? 0;
    this.createdAt = data.createdAt ?? new Date();
    this.endAt = data.endAt;
    this.paymentRequest = data.paymentRequest;
  }
}