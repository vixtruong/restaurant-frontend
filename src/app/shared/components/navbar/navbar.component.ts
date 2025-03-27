import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'
import { AvatarModule } from 'primeng/avatar';
import { MenuCategory } from '../../constants/menu.constants';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { OrderCartComponent } from "../../../features/customer/pages/order-cart/order-cart.component";

@Component({
  selector: 'app-navbar',
  imports: [ToolbarModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, AvatarModule, FormsModule, DrawerModule, OrderCartComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  categories = Object.entries(MenuCategory).map(([key, value]) => ({
    name: value,
    value: value,
  }));

  selectedCategory: string = "";
  searchQuery: string = "";
  visible: boolean = false;

  @Output() categorySelectEvent = new EventEmitter<string>();
  @Output() searchQueryEvent = new EventEmitter<string>();
  @ViewChild(OrderCartComponent) cart!: OrderCartComponent;

  onCategoryChange() {
    this.categorySelectEvent.emit(this.selectedCategory);
  }

  onInputSearchQuery() {
    this.searchQueryEvent.emit(this.searchQuery);
  }

  reloadCart() {
    this.cart.ngOnInit();
  }
}
