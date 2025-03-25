import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../../core/models/class/menu-item';

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, InputNumberModule, FormsModule],
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.css']
})
export class MenuCardItemComponent {
  @Input() item!: MenuItem;
  quantity: number = 1;
}
