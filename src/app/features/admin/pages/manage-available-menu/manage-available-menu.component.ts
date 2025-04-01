import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { MenuItemService } from '../../../../core/services/menu-item.service';
import { MenuItem } from '../../../../core/models/menu-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-available-menu',
  imports: [CommonModule, FormsModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ConfirmDialogModule, ToastModule, ToggleButtonModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-available-menu.component.html',
  styleUrl: './manage-available-menu.component.css'
})
export class ManageAvailableMenuComponent {
  private menuItemService = inject(MenuItemService);
  private conformationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  menuItems: MenuItem[] = [];
  @ViewChild('dt2', { static: false }) dt2!: Table;

  ngOnInit() {
    this.menuItemService.getAllMenuItems().subscribe({
      next: data => {
        this.menuItems = data.map(item => {
          const newItem = new MenuItem(item);
          newItem.tempStatus = newItem.kitchenAvailable;
          return newItem;
        });
        console.log(this.menuItems);
      },
      error: err => console.log(err),
      complete: () => console.log('Complete load menu itms')
    });
  }

  onGlobalSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();
    if (this.dt2) {
      this.dt2.filterGlobal(query, 'contains');
    }
  }

  confirmChangeStatus(id: number, item: MenuItem) {
    this.conformationService.confirm({
      message: 'Are you sure to change status this food?',
      header: 'Confirm change status',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Change',
      rejectLabel: 'Cancle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.changeStatus(id);
      },
      reject: () => {
        item.tempStatus = item.kitchenAvailable;
      }
    });
  }

  changeStatus(id: number) {
    this.menuItemService.updateItemStatus(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Update successfully',
          detail: 'Status is updated successfully.',
          life: 3000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Update food status fail.',
          life: 3000
        });
      }
    });
  }
}
