import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntryRequest } from '../../../core/models/class/entry-request';

import { AuthService } from '../../../core/services/auth.service';


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
      phoneNumber: ['', Validators.required]
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
      const { fullName, phoneNumber } = this.entryForm.value;
      const entryRequest = new EntryRequest(fullName, phoneNumber);
      this.authService.entry(entryRequest).subscribe({
        next: (res) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          console.log('✅ Đăng nhập thành công');

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
}
