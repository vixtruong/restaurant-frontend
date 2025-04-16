import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';
import { EntryRequestDto } from '../../../core/dtos/entry-request.dto';

  
@Component({
  selector: 'app-entry',
  imports: [CommonModule, InputTextModule, CardModule, ButtonModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css'
})
export class EntryComponent {
  entryForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor(private fb: FormBuilder) {
    this.entryForm = fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      tableNumber: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  preventNonNumericInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.entryForm.valid) {
      const { fullName, phoneNumber, tableNumber } = this.entryForm.value;

      const entryRequest = new EntryRequestDto(fullName, phoneNumber, Number.parseInt(tableNumber));
      
      this.authService.customerEntry(entryRequest).subscribe({
            next: (res) => {
              localStorage.setItem('accessToken', res.accessToken);
              localStorage.setItem('refreshToken', res.refreshToken);
              localStorage.setItem('orderId', res.orderId);
              localStorage.setItem('role', 'Customer');
              localStorage.setItem('tableNumber', tableNumber);
              console.log('✅ Đăng nhập thành công');
      
              const payload = this.decodeJwt(res.accessToken);
              const userId = payload?.nameid;
      
              localStorage.setItem('userId', userId);

              this.messageService.add({
                severity: 'success',
                summary: 'Entry successfully.',
                detail: `Welcome to our restaurant`,
                life: 3000
              });
      
              this.router.navigate(['/home']);
            },
            error: (err) => {
              console.error('❌ Đăng nhập thất bại:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Entry fail.',
                detail: `Table is not available`,
                life: 3000
              });
            },
            complete: () => {
              console.log('🔁 Hoàn tất xử lý entry request.');
            }
          });
    }
  }

  decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }
}
