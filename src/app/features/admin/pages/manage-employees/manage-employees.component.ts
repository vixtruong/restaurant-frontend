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
    this.userService.getAllEmployees().subscribe({
      next: data => {
        this.users = data.map(user => new User(user));
        console.log(this.users);
      },
      error: err => console.log(err),
      complete: () => console.log('Load employees conpletely.')
    });
  }

  onGlobalSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();
    if (this.dt2) {
      this.dt2.filterGlobal(query, 'contains');
    }
  }

  confirmDelete(id: number) {

  }
}
