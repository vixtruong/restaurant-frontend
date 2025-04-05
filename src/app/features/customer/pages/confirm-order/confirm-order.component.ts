import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { BadgeModule } from 'primeng/badge'
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { KitchenOrderService } from '../../../../core/services/kitchen-order.service';
import { KitchenOrder } from '../../../../core/models/kitchen-order.model';
import { ConfirmOrderCardComponent } from "../../components/confirm-order-card/confirm-order-card.component";
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-confirm-order',
  imports: [CommonModule, DrawerModule, ButtonModule, ContextMenuModule, BadgeModule, ToastModule, ConfirmDialogModule,  ConfirmOrderCardComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css'
})

export class ConfirmOrderComponent implements OnChanges {
  kitchenService = inject(KitchenOrderService);
  cartService = inject(CartService);

  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  @Input() visible!: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  kitchentOrders: KitchenOrder[] = [];
  @ViewChild('cm') cm!: ContextMenu;

  selectedKitchenOrder?: KitchenOrder;
  totalPrice: number = 0;

  items = [
    {
      label: 'Cancel',
      icon: 'pi pi-times',
      command: () => this.confirmCancel(this.selectedKitchenOrder!)
    }
  ];

  ngOnChanges(changes: SimpleChanges) {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      this.kitchenService.getKitchenOrdersByOrderId(parseInt(orderId)).subscribe({
        next: data => {
          this.totalPrice = 0;

          this.kitchentOrders = data.map(item => new KitchenOrder(item));

          this.kitchentOrders.forEach(order => {
            this.totalPrice += order.menuItem.price * order.quantity;
          });
        }
      });
    }
  }

  onContextMenu(event: MouseEvent, order: KitchenOrder) {
    event.preventDefault();
    this.selectedKitchenOrder = order;
    this.cm.show(event);
  }

  confirmCancel(order: KitchenOrder) {
    this.confirmationService.confirm({
      message: 'Are you sure cancel this order?',
      header: 'Cancel order',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-info',
      accept: () => {
        this.cancelOrder(order);
      }
    });
  }

  cancelOrder(order: KitchenOrder) {
    if (order.status !== 'Pending') {
      this.messageService.add({
        severity: 'error',
        summary: 'Cancel fail',
        detail: `This order is preparing. Can not cancel.`,
        life: 3000
      });

      return;
    }

    this.kitchenService.deleteKitchenOrder(order.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cancel successfully',
          detail: `You have canceled ${order.menuItem.name} successfully.`,
          life: 3000
        });
        const index = this.kitchentOrders.findIndex(k => k.id === order.id);
        this.kitchentOrders = this.kitchentOrders.filter(k => k.id !== order.id);
        this.cartService.cancelItem(index);
      
        this.totalPrice = 0;
        this.kitchentOrders.forEach(order => {
          this.totalPrice += order.menuItem.price * order.quantity;
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancel fail',
          detail: `You have canceled ${order.menuItem.name} fail.`,
          life: 3000
        });
      }
    });
  }
}
