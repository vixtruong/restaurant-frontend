export class OrderDetailDto {
  readonly orderId: number;
  customerId: number;
  customerName: string;
  tableNumber: number;
  isPaid: boolean;
  orderItems: OrderItemDetailDto[];

  constructor(data: Partial<OrderDetailDto>) {
    this.orderId = data.orderId ?? 0,
    this.customerId = data.customerId ?? 0,
    this.customerName = data.customerName ?? "",
    this.tableNumber = data.tableNumber ?? 0,
    this.orderItems = data.orderItems ?? []
    this.isPaid = data.isPaid ?? false;
  }
}

export class OrderItemDetailDto {
  readonly id: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  price: number;

  constructor(data: Partial<OrderItemDetailDto>) {
    this.id = data.id ?? 0;
    this.menuItemName = data.menuItemName ?? "",
    this.quantity = data.quantity ?? 0,
    this.price = data.price ?? 0,
    this.unitPrice = data.unitPrice ?? 0
  }
}