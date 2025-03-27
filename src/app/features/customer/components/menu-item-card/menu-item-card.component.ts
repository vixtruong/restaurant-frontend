import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../../../core/models/class/menu-item.model';
import { OrderItem } from '../../../../core/models/class/order-item.model';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, InputNumberModule, FormsModule],
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.css'],
})

export class MenuCardItemComponent {
  @Input() item!: MenuItem;
  quantity: number = 1;
  
  private cartService = inject(CartService);

  addMenuItemToCart() {
    const orderItem = new OrderItem({
      id: this.item.id,
      name: this.item.name,
      category: this.item.category,
      imgUrl: this.item.imgUrl,
      quantity: this.quantity,
      price: this.item.price
    });
    
    this.cartService.addToCart(orderItem);
    
    console.log('🛒 Đã thêm vào giỏ hàng:', orderItem);
  }
}
