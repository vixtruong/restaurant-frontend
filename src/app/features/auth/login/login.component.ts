import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequestDto } from '../../../core/dtos/login-request.dto';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ButtonModule, CardModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);

  constructor(fb: FormBuilder) {
    this.loginForm = fb.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required]
      }
    );
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password} = this.loginForm.value;
      const loginRequest = new LoginRequestDto({email: email, password: password});

      this.authService.login(loginRequest);
    }
  }
}
