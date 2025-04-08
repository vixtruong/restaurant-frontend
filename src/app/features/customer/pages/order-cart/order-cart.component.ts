import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { BadgeModule } from 'primeng/badge'
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService } from 'primeng/api';

import { OrderItem } from '../../../../core/models/order-item.model';
import { OrderItemCardComponent } from "../../components/order-item-card/order-item-card.component";
import { CartService } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-cart',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule, ContextMenuModule, BadgeModule, OrderItemCardComponent, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './order-cart.component.html',
  styleUrl: './order-cart.component.css'
})

export class OrderCartComponent {
  @Input() visible!: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  orderItems: OrderItem[] = [];
  selectedId: number = 0;
  @ViewChild('cm') cm!: ContextMenu;

  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  confirmationService = inject(ConfirmationService);

  isSubmitting = false;

  items = [
    {
      label: 'Remove',
      icon: 'pi pi-trash',
      command: () => this.removeSelectedItem()
    }
  ];

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.orderItems = cart;
    });
  }

  onContextMenu(event: MouseEvent, product: OrderItem) {
    event.preventDefault();
    this.selectedId = product.id;
    this.cm.show(event);
  }

  onHide() {
    this.selectedId = 0;
  }
  
  removeSelectedItem() {  
    this.orderItems = this.orderItems.filter(p => p.id !== this.selectedId || p.confirmed === true);
    this.cartService.removeItem(this.selectedId);
  }
  
  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  confirmOrder() {
    if (this.cartService.getCart().length === 0) return;

    this.confirmationService.confirm({
      header: 'Confirm Order',
      message: 'Are you sure confirm order?',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-info',
      accept: () => {
        this.isSubmitting = true;

        this.orderService.createOrder().subscribe({
          next: data => {
            localStorage.setItem('orderId', data['id']);
    
            const orderId = localStorage.getItem('orderId');
    
            console.log(`Don hang ${orderId} da duoc tao!`);
          },
          error: err => console.log(err),
          complete: () => {
            console.log("Order thành công");
          }
        });
      }
    }); 
  }
}
