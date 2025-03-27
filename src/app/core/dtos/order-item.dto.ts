export class OrderItemDto {
  menuItemId: number;
  quantity: number;

  constructor(data: Partial<OrderItemDto> = {}) {
    this.menuItemId = data.menuItemId ?? 1,
    this.quantity = data.menuItemId ?? 1
  }
}