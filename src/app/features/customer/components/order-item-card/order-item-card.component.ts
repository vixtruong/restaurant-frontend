import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderItem } from '../../../../core/models/class/order-item.model';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-order-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-item-card.component.html',
  styleUrl: './order-item-card.component.css'
})
export class OrderItemCardComponent {
  @Input() orderItem!: OrderItem;
  @Input() disabled: boolean = false;

  private cartService = inject(CartService);

  increaseQuantity() {
    this.cartService.updateQuantity(this.orderItem.id, 1);
  }

  decreaseQuantity() {
    this.cartService.updateQuantity(this.orderItem.id, -1);
  }
}
