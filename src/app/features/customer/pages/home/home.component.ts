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
  selectedCatgory: string = "";
  searchQuery: string = "";

  ngOnInit() {
    this.menuItemService.getAllMenuItems().subscribe({
      next: data => {
        this.menuItems = data.map(item => new MenuItem(item));
        console.log("List MenuItems: ", this.menuItems);
      },
      error: err => console.log("Error when call API: ", err),
      complete: () => console.log("Call API completely!")
    });
  }
  
  onCategoryChange(category: string) {
    this.selectedCatgory = category;
  }

  onInputSerchQuery(query: string) {
    this.searchQuery = query;
  }

  removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase();
  }

  get filteredMenuItems(): MenuItem[] {
    const query = this.removeVietnameseTones(this.searchQuery || '');
    const category = this.selectedCatgory;
  
    return this.menuItems.filter(item => {
      const matchCategory = category === 'Tất cả' || category === '' || item.category === category;
      const itemName = this.removeVietnameseTones(item.name);
      const matchSearch = query === '' || itemName.includes(query);
      return matchCategory && matchSearch;
    });
  }
}
