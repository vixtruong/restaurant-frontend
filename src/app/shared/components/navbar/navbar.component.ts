import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'
import { AvatarModule } from 'primeng/avatar';
import { MenuCategory } from '../../constants/menu.constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [ToolbarModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, AvatarModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  categories = Object.entries(MenuCategory).map(([key, value]) => ({
    name: value,
    value: key,
  }));

  selectedCategory: string = "";
}
