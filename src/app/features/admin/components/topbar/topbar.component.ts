import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, AvatarModule, ToolbarModule, ButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Output() menuToggle = new EventEmitter<void>();

  private router = inject(Router);
  onToggleClick() {
    this.menuToggle.emit();
  }

  onClickLogo() {
    this.router.navigate(['admin/dashboard']);
  }
}
