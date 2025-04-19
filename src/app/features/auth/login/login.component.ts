import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequestDto } from '../../../core/dtos/login-request.dto';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ButtonModule, CardModule, ReactiveFormsModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

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

      this.authService.login(loginRequest).subscribe({
            next: res => {
              this.authService.setAccessToken(res.accessToken);
              localStorage.setItem('refreshToken', res.refreshToken);
              console.log('✅ Log in Đăng nhập thành công');
      
              const token = this.authService.getAccessToken();
      
              if (token) {
                const payload = this.authService.decodeJwt(token);
      
                const userId = payload?.nameid;
      
                localStorage.setItem('userId', userId);
      
                const decoded: any = jwtDecode(token);
                const role = decoded?.role;
      
                localStorage.setItem('role', role);
              }
      
              if (token) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Log in successfully.',
                  detail: 'Welcome to restaurant dashboard',
                  life: 3000
                });

                this.router.navigate(['/admin']);
              }
              
            },
            error: err => {
              console.log("Fail log in!", err);
              this.messageService.add({
                severity: 'error',
                summary: 'Log in fail.',
                detail: 'Please check your information.',
                life: 3000
              });
            },
            complete: () => console.log('Complete login request')
          });
    }
  }
}
