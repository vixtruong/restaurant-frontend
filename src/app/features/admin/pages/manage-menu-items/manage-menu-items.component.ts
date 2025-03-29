import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { MenuItemService } from '../../../../core/services/menu-item.service';
import { MenuItem } from '../../../../core/models/menu-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-items-management',
  imports: [CommonModule, ButtonModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-menu-items.component.html',
  styleUrl: './manage-menu-items.component.css'
})
export class ManageMenuItemsComponent {
  private menuItemService = inject(MenuItemService);
  private conformationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  menuItems: MenuItem[] = [];
  @ViewChild('dt2', { static: false }) dt2!: Table;

  ngOnInit() {
    this.menuItemService.getAllMenuItems().subscribe({
      next: data => {
        this.menuItems = data.map(item => new MenuItem(item));
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

  updateMenuItem(item: MenuItem) {
    this.router.navigate(['/admin/menu-items/update', item.id], { state: { item } });
  }

  confirmDelete(id: number, name: string) {
    this.conformationService.confirm({
      message: 'Are you sure to delete this food?',
      header: 'Confirm delete menu item',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteMenuItem(id, name);
      }
    });
  }

  deleteMenuItem(id: number, name: string) {
    this.menuItemService.deleteMenuItem(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Delete successfully',
          detail: `${name} is deleted successfully.`,
          life: 3000
        });
        
        this.menuItems = this.menuItems.filter(item => item.id !== id);
      },
      error: (err) => {
        if (err.status === 409) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Không thể xóa',
            detail: err.error.message || 'Món ăn đang được sử dụng, không thể xóa.',
            life: 3000
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Xóa món ăn thất bại.',
            life: 3000
          });
        }
      }
    });
  }
}
