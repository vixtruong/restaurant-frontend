import { MenuItem } from "./menu-item.model";

export class KitchenOrder {
  readonly id: number;
  orderItemId: number;
  tableNumber: number;
  menuItem: MenuItem;
  quantity: number;
  status: string;
  tempStatus?: string;
  done?: boolean;
  cookAt?: Date;

  constructor(data: Partial<KitchenOrder>) {
    this.id = data.id ?? 0;
    this.orderItemId = data.orderItemId ?? 0;
    this.tableNumber = data.tableNumber ?? 0;
    this.quantity = data.quantity ?? 0;
    this.menuItem = data.menuItem ?? new MenuItem();
    this.status = data.status ?? "";
    this.done = data.done;
  }
}