import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KitchenOrder } from '../../../../core/models/kitchen-order.model';
import { MenuItem } from '../../../../core/models/menu-item.model';
import { MenuItemService } from '../../../../core/services/menu-item.service';

@Component({
  selector: 'app-confirm-order-card',
  imports: [CommonModule],
  templateUrl: './confirm-order-card.component.html',
  styleUrl: './confirm-order-card.component.css'
})
export class ConfirmOrderCardComponent {
  menuItemService = inject(MenuItemService);

  @Input() kitchenItem!: KitchenOrder;

  menuItem?: MenuItem;

  ngOnInit() {
    this.menuItemService.getMenuItemById(this.kitchenItem.menuItem.id).subscribe({
      next: data => this.menuItem = new MenuItem(data),
      error: err => console.log(err)
    });
  }
}
