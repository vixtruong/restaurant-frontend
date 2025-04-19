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
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-manage-employees',
  imports: [CommonModule, ButtonModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ConfirmDialogModule, ToastModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage-employees.component.html',
  styleUrl: './manage-employees.component.css'
})

export class ManageEmployeesComponent {
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  users: User[] = [];
  @ViewChild('dt2', { static: false }) dt2!: Table;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllEmployees().subscribe({
      next: data => {
        this.users = data.map(user => new User(user)).sort((a, b) => {
          if (a.active === true && b.active !== true) return -1;
          if (a.active !== true && b.active === true) return 1;
          return 0;
        });
      },
      error: err => console.error(err),
      complete: () => console.log('Employees loaded.')
    });
  }
  

  onGlobalSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();
    if (this.dt2) {
      this.dt2.filterGlobal(query, 'contains');
    }
  }

  confirmToggleUserActiveStatus(user: User) {
    var action = user.active ? 'deactivate' : 'activate'

    this.confirmationService.confirm({
      message: `Are you sure to ${action} user ${user.fullName}?`,
      header: `Confirm ${action} user`,
      icon: 'pi pi-question-circle',
      acceptLabel: user.active ? 'Deactivate' : 'Activate',
      rejectLabel: 'Cancle',
      acceptButtonStyleClass: user.active ? 'p-button-warn' : 'p-button-info',
      accept: () => {
        this.toggleUserActive(user.id, user.active!);
      }
    });
  }

  toggleUserActive(id: number, currentActive: boolean) {
    this.userService.toggleUserActiveStatusAsync(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: currentActive ? 'User deactivated' : 'User activated',
          detail: `User #${id} is now ${currentActive ? 'inactive' : 'active'}.`,
          life: 3000
        });

        this.loadUsers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Operation failed',
          detail: `Could not update status for user #${id}.`
        });
      }
    });
  }
}
