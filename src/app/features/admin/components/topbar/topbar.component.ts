import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, AvatarModule, ToolbarModule, ButtonModule, SpeedDialModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  items: MenuItem[] = [];
  
  @Output() menuToggle = new EventEmitter<void>();

  private router = inject(Router);

  ngOnInit() {
    this.items = [
      {
        label: 'Thông tin',
        icon: 'pi pi-user',
        command: () => this.viewProfile()
      },
      {
        label: 'Đổi mật khẩu',
        icon: 'pi pi-lock',
        command: () => this.changePassword()
      },
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

  viewProfile() {
    console.log('Thông tin cá nhân');
  }

  changePassword() {
    console.log('Đổi mật khẩu');
  }

  logout() {
    console.log('Đăng xuất');
  }
}
