import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 để dùng ngModel
import { OrderItem } from '../../../../core/models/order-item.model';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-order-item-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-item-card.component.html',
  styleUrl: './order-item-card.component.css'
})
export class OrderItemCardComponent {
  @Input() orderItem!: OrderItem;
  @Input() disabled: boolean = false;

  private cartService = inject(CartService);

  isNoteModalOpen = false;
  tempNote: String = '';

  increaseQuantity() {
    this.cartService.updateQuantity(this.orderItem.id, 1);
  }

  decreaseQuantity() {
    this.cartService.updateQuantity(this.orderItem.id, -1);
  }

  openNoteModal() {
    this.tempNote = this.orderItem.notes || '';
    this.isNoteModalOpen = true;
  }

  saveNote() {
    this.cartService.updateNote(this.orderItem.id, this.tempNote.toString());
    this.isNoteModalOpen = false;
  }

  cancelNote() {
    this.isNoteModalOpen = false;
  }
}
