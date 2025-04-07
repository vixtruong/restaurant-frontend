import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, AvatarModule, ToolbarModule, ButtonModule, SpeedDialModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  authService = inject(AuthService);

  items: MenuItem[] = [];
  
  @Output() menuToggle = new EventEmitter<void>();

  private router = inject(Router);

  ngOnInit() {
    this.items = [
      {
        label: 'Đăng xuất',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  onToggleClick() {
    this.menuToggle.emit();
  }

  onClickLogo() {
    this.router.navigate(['admin/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}
