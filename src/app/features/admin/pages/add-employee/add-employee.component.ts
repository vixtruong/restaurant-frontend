import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Roles } from '../../../../shared/constants/user.contants';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, InputTextModule, FloatLabelModule, TextareaModule, FileUploadModule, SelectModule, ReactiveFormsModule, ToastModule, ImageModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {
  employeeFormGroup: FormGroup;
  roles = Object.entries(Roles).map(([key, value]) => ({
      name: value,
      value: value,
  })).slice(1);

  userService = inject(UserService);
  router = inject(Router);
  messageService = inject(MessageService);
  conformationService = inject(ConfirmationService);
  
  constructor(private fb: FormBuilder) {
    this.employeeFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      role: [null, Validators.required]
    });
  }

  preventNonNumericInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  confirmSubmit() {
    this.conformationService.confirm({
      message: 'Are you sure you want to add this employee?',
      header: 'Confirm add menu item',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Add',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.onSubmitCreate();
      }
    });
  }

  onSubmitCreate() {
    if (this.employeeFormGroup.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form invalid',
        detail: 'Please fill all fields.',
        life: 3000
      });
  
      this.employeeFormGroup.markAllAsTouched();
      return;
    }

    const { fullName, role, email, phoneNumber } = this.employeeFormGroup.value;

    var roleId: number;
    
    console.log(role);

    console.log(role.value === "Quản lý");
    if (role.value === "Quản lý") {
      roleId = 1;
    } else if (role.value === "Bồi bàn") {
      roleId = 2;
    } else {
      roleId = 3;
    }

    const employee = new User({ fullName: fullName, roleName: role, roleId: roleId, email: email, phoneNumber: phoneNumber });

    this.userService.addEmployees(employee).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Create successfully.',
          detail: `${employee.fullName} is added successfully!`,
          life: 3000
        });
        setTimeout(() => {
          this.router.navigate([`/admin/employees`]);
        }, 1500); 
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Create failed!',
          detail: `${employee.fullName} is added failed.`,
          life: 3000
        });
        console.log(err);
      },
      complete: () => console.log('Add new employee completely.')
    });
  }
}
