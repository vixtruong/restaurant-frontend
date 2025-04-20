export class OrderItemDto {
  menuItemId: number;
  quantity: number;
  notes?: String;

  constructor(data: Partial<OrderItemDto> = {}) {
    this.menuItemId = data.menuItemId ?? 1,
    this.quantity = data.menuItemId ?? 1,
    this.notes = data.notes
  }
}