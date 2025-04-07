import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

import { KitchenOrder } from '../../../../core/models/kitchen-order.model';
import { KitchenOrderService } from '../../../../core/services/kitchen-order.service';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manage-kitchen-orders',
  imports: [CommonModule, FormsModule, SelectModule, TableModule, ConfirmDialogModule, ToastModule, ButtonModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage-kitchen-orders.component.html',
  styleUrl: './manage-kitchen-orders.component.css'
})

export class ManageKitchenOrdersComponent {
  kitchenService = inject(KitchenOrderService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  kitchenOrders: KitchenOrder[] = [];
  filterKitchenOrders: KitchenOrder[] = [];
  @ViewChild('dt2', { static: false }) dt2!: Table;

  isKitchen: boolean = true;

  stateOptions = [
    { name: 'Tất cả', value: 'Tất cả' },
    { name: 'Pending', value: 'Pending' },
    { name: 'Cooking', value: 'Cooking' },
    { name: 'Ready', value: 'Ready' }
  ];

  doneStatus = [
    { name: 'Tất cả', value: 'Tất cả' },
    { name: 'Undone', value: 'Undone' },
    { name: 'Done', value: 'Done' },
  ]

  options: any[] =  [];

  tempStatus: string | null = null;

  getAvailableOptions(item: KitchenOrder) {
    if (item.status === 'Cooking') {
      return this.stateOptions.filter(opt => opt.value !== 'Pending').slice(1);
    }
    if (item.status === 'Ready') {
      return this.stateOptions.filter(opt => opt.value === 'Ready').slice(0);
    }
    return this.stateOptions.slice(1);
  }

  ngOnInit() {
    const role = localStorage.getItem('role')!;

    this.isKitchen = role === 'Nhân viên bếp';

    if (this.isKitchen) {
      this.options = this.stateOptions;
    } else {
      this.options = this.doneStatus;
    }

    this.kitchenService.getKitchenOrdersToday().subscribe({
      next: data => {
        this.kitchenOrders = data.map(item => {
          const order = new KitchenOrder(item);
          order.tempStatus = order.status;
          return order;
        });

        console.log(this.kitchenOrders);

        if (role !== 'Nhân viên bếp') {
          this.filterKitchenOrders = this.kitchenOrders.filter(order => order.status === 'Ready');
        } else {
          this.filterKitchenOrders = this.kitchenOrders;
        }
      },
      error: err => console.log(err),
      complete: () => console.log('Load kitchen orders completely')
    });
  }

  onFilterStatusOrders(event: any) {
    if (this.isKitchen) {
      if (event.value !== "Tất cả") {
        this.filterKitchenOrders = this.kitchenOrders.filter(order => order.status === event.value);
      } else {
        this.filterKitchenOrders = this.kitchenOrders;
      }
    } else {
      if (event.value !== "Tất cả") {
        const done = (event.value === 'Done') ? true : false;

        this.filterKitchenOrders = this.kitchenOrders.filter(order => order.done === done && order.status === 'Ready');
      } else {
        this.filterKitchenOrders = this.kitchenOrders.filter(order =>  order.status === 'Ready');
      }
    }
  }

  confirmChangeStatus(newStatus: string, order: KitchenOrder) {
    if (newStatus === order.status) return;

    this.confirmationService.confirm({
      message: `Are you sure to change ${order.menuItem.name} status to ${newStatus}?`,
      header: 'Confirm change kitchen order status',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Submit',
      rejectLabel: 'Cancle',
      acceptButtonStyleClass: 'p-button-warn',
      accept: () => {
        this.onStatusChange(newStatus, order);
      },
      reject: () => {
        order.tempStatus = order.status;
      }
    });
  }

  onStatusChange(newStatus: string, order: KitchenOrder) {
    if (newStatus === 'Cooking') {
      this.kitchenService.updateStatusToCooking(order.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Update successfully.',
            detail: `${order.menuItem.name} is updated status successfully!`,
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update failed!',
            detail: `${order.menuItem.name} is updated status failed.`,
            life: 3000
          });
        },
        complete: () => console.log('Update food status completely.')
      });
    }

    if (newStatus === 'Ready') {
      this.kitchenService.updateStatusToReady(order.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Update successfully.',
            detail: `${order.menuItem.name} is updated status successfully!`,
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update failed!',
            detail: `${order.menuItem.name} is updated status failed.`,
            life: 3000
          });
        },
        complete: () => console.log('Update food status completely.')
      });
    }
  }

  confirmDone(order: KitchenOrder) {
    this.confirmationService.confirm({
      message: `Are you sure to change ${order.menuItem.name} status to done?`,
      header: 'Confirm change kitchen order status',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Submit',
      rejectLabel: 'Cancle',
      acceptButtonStyleClass: 'p-button-warn',
      accept: () => {
        order.done = true;
        this.updateDone(order);
      },
      reject: () => {
        order.done = false;
      }
    });
  }

  updateDone(order: KitchenOrder) {
    this.kitchenService.updateStatusDone(order.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Update successfully.',
          detail: `${order.menuItem.name} is updated status successfully!`,
          life: 3000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update failed!',
          detail: `${order.menuItem.name} is updated status failed.`,
          life: 3000
        });
      },
      complete: () => console.log('Update food status completely.')
    });
  }
}