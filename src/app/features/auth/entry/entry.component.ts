import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { EntryRequestDto } from '../../../core/dtos/entry-request.dto';
import { Router } from '@angular/router';

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

      localStorage.setItem('tableNumber', tableNumber);

      const entryRequest = new EntryRequestDto(fullName, phoneNumber);
      this.authService.customerEntry(entryRequest);
    }
  }

  decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }
}
