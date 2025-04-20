import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuItemService } from '../../../../core/services/menu-item.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../core/models/menu-item.model';
import { MenuCardItemComponent } from "../../components/menu-item-card/menu-item-card.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, CardModule, ButtonModule, CommonModule, MenuCardItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: []
})
export class HomeComponent {
  private menuItemService = inject(MenuItemService);
  menuItems: MenuItem[] = [];
  selectedCategory: string = "";
  searchQuery: string = "";

  ngOnInit() {
    this.menuItemService.getAllMenuItems().subscribe({
      next: data => {
        this.menuItems = data.map(item => new MenuItem(item));
        console.log("List MenuItems: ", this.menuItems);
      },
      error: err => console.error("Error when calling API: ", err),
      complete: () => console.log("API call completed!")
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }

  onInputSearchQuery(query: string) {
    this.searchQuery = query;
  }

  removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase();
  }

  // Nhóm menu items theo danh mục
  get groupedMenuItems(): { category: string, items: MenuItem[] }[] {
    const query = this.removeVietnameseTones(this.searchQuery || '');
    const category = this.selectedCategory;

    // Lọc danh sách menu items
    const filteredItems = this.menuItems.filter(item => {
      const matchCategory = category === 'Tất cả' || category === '' || item.category === category;
      const itemName = this.removeVietnameseTones(item.name);
      const matchSearch = query === '' || itemName.includes(query);
      return matchCategory && matchSearch && item.kitchenAvailable;
    });

    // Nhóm theo danh mục
    const grouped = filteredItems.reduce((acc, item) => {
      const category = item.category || 'Khác';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    // Sắp xếp danh mục theo thứ tự ưu tiên: Khai vị, Món chính, Tráng miệng, Đồ uống, Khác
    const categoryOrder = ['Khai vị', 'Bữa chính', 'Tráng miệng', 'Đồ uống'];
    return Object.keys(grouped)
      .sort((a, b) => {
        const indexA = categoryOrder.indexOf(a) === -1 ? 999 : categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b) === -1 ? 999 : categoryOrder.indexOf(b);
        return indexA - indexB;
      })
      .map(category => ({
        category,
        items: grouped[category]
      }));
  }

  // Hàm trackBy để tối ưu render
  trackByCategory(index: number, group: { category: string, items: MenuItem[] }): string {
    return group.category;
  }

  trackByItem(index: number, item: MenuItem): number {
    return item.id;
  }
}