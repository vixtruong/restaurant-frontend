import { MenuCategory } from "../../shared/constants/menu.constants";

export class MenuItem {
  readonly id: number;
  name: string;
  category: MenuCategory;
  description: string;
  imgUrl: string;
  price: number;
  available: boolean;
  tempStatus?: boolean;
  kitchenAvailable: boolean;

  constructor(data: Partial<MenuItem> = {}) {
    this.id = data.id ?? 0;
    this.name = data.name ?? 'Món ăn chưa đặt tên';
    this.category = this.mapCategory(data.category);
    this.description = data.description ?? 'Không có mô tả';
    this.imgUrl = data.imgUrl ?? "assets/images/default-food.jpg";
    this.price = data.price ?? 0;
    this.available = data.available ?? true;
    this.kitchenAvailable = data.kitchenAvailable ?? true;
  }

  getFormattedPrice(): string {
    return this.price.toLocaleString('vi-VN') + ' ₫';
  }

  getImageUrl(): string {
    return this.imgUrl || "assets/images/default-food.jpg"; // Nếu không có ảnh, dùng ảnh mặc định
  }

  toggleAvailability(): void {
    this.available = !this.available;
  }

  private mapCategory(category?: string): MenuCategory {
    const categoryMap: Record<string, MenuCategory> = {
      "Khai vị": MenuCategory.Appetizer,
      "Món chính": MenuCategory.MainCourse,
      "Tráng miệng": MenuCategory.Dessert,
      "Đồ uống": MenuCategory.Beverage
    };
    return categoryMap[category ?? ""] || MenuCategory.MainCourse;
  }
}
