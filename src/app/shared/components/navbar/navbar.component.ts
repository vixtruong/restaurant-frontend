import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService } from 'primeng/api';

import { MenuCategory } from '../../constants/menu.constants';
import { OrderCartComponent } from "../../../features/customer/pages/order-cart/order-cart.component";
import { ConfirmOrderComponent } from "../../../features/customer/pages/confirm-order/confirm-order.component";
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-navbar',
  imports: [ToolbarModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, AvatarModule, FormsModule, DrawerModule, OrderCartComponent, ConfirmOrderComponent, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  orderService = inject(OrderService);
  confirmationService = inject(ConfirmationService);

  categories = Object.entries(MenuCategory).map(([key, value]) => ({
    name: value,
    value: value,
  }));

  selectedCategory: string = "";
  searchQuery: string = "";
  orderCartVisible: boolean = false;
  confirmedOrderVisible: boolean = false;

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

  confirmExit() {
    this.confirmationService.confirm({
      message: 'Are you sure exit our system?',
      header: 'Exit system.',
      icon: 'pi pi-power-off',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-info',
      accept: () => {
        this.onExit();
      }
    });
  }

  onExit() {
    const orderId = localStorage.getItem('orderId');
  
    if (orderId) {
      this.orderService.handleEmptyOrderId(Number.parseInt(orderId)).subscribe({
        next: () => {
          console.log('Delete order empty successfully.');
  
          setTimeout(() => {
            localStorage.clear();
            window.location.reload();
          }, 3000);
        },
        error: (err) => {
          console.error('Error deleting empty order:', err);
          localStorage.clear();
          window.location.reload();
        }
      });
    } else {
      localStorage.clear();
      window.location.reload();
    }
  }
  
}
