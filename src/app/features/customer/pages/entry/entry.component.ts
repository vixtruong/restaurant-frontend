import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';
import { EntryRequestDto } from '../../../../core/dtos/entry-request.dto';

@Component({
  selector: 'app-entry',
  imports: [CommonModule, InputTextModule, CardModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css'
})
export class EntryComponent {
  entryForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.entryForm = fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      tableNumber: ['', Validators.required]
    });
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

      localStorage.setItem('tableNumber', tableNumber);

      const entryRequest = new EntryRequestDto(fullName, phoneNumber);
      this.authService.customerEntry(entryRequest).subscribe({
        next: (res) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          console.log('✅ Đăng nhập thành công');

          const payload = this.decodeJwt(res.accessToken);
          const userId = payload?.nameid;

          localStorage.setItem('userId', userId);

          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('❌ Đăng nhập thất bại:', err);
          alert('Đăng nhập thất bại. Vui lòng thử lại!');
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
