import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from "../components/topbar/topbar.component";
import { SlidebarComponent } from "../components/slidebar/slidebar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, TopbarComponent, SlidebarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  showSlidebar = true;

  toggleSlidebar() {
    this.showSlidebar = !this.showSlidebar;
  }
}
