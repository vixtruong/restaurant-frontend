export class OrderItem {
  readonly id: number;
    name: string;
    category: string;
    imgUrl: string;
    quantity: number;
    price: number;
    confirmed: boolean = false;
    
  constructor(data: Partial<OrderItem> = {}) {
    this.id = data.id ?? 0;
    this.name = data.name ?? 'Món ăn chưa đặt tên';
    this.category = data.category ?? "Bữa chính";
    this.imgUrl = data.imgUrl ?? "assets/images/default-food.jpg";
    this.quantity = data.quantity ?? 1;
    this.price = data.price ?? 0;
    this.confirmed = data.confirmed ?? false;
  }

  get totalPrice(): number {
    return this.quantity * this.price;
  }
}