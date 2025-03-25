import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { MenuItemService } from '../../../core/services/menu-item.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../core/models/class/menu-item';
import { MenuCardItemComponent } from "../menu-item-card/menu-item-card.component";

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
  quantity = 1;

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
  
}
