import { OrderItemDto } from "./order-item.dto";

export class OrderRequestDto {
  orderId?: number;
  customerId!: number;
  tableNumber!: number;
  items: OrderItemDto[] = [];

  constructor(data: Partial<OrderRequestDto> = {}) {
    this.orderId = data.orderId,
    this.customerId = data.customerId ??  1,
    this.tableNumber = data.tableNumber ?? 1,
    this.items = data.items ?? []
  }
}