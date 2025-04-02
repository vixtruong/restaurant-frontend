export class OrderDetailDto {
  readonly orderId: number;
  customerName: string;
  tableNumber: number;
  orderItems: OrderItemDetailDto[];

  constructor(data: Partial<OrderDetailDto>) {
    this.orderId = data.orderId ?? 0,
    this.customerName = data.customerName ?? "",
    this.tableNumber = data.tableNumber ?? 0,
    this.orderItems = data.orderItems ?? []
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