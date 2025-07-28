import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-slidebar',
  imports: [CommonModule, MenuModule, RouterModule],
  templateUrl: './slidebar.component.html',
  styleUrl: './slidebar.component.css'
})

export class SlidebarComponent {
  role: string = '';

  items = [
    {
      label: 'Home',
      items: [
        { label: 'Dashboard', icon: 'pi pi-home', route: '/admin' }
      ]
    },
    {
      label: 'Tables',
      items: [
        { label: 'Manage tables', icon: 'pi pi-table', route: '/admin/tables' }
      ]
    },
    {
      label: 'Orders',
      items: [
        { label: 'Manage Customer Orders', icon: 'pi pi-check-square', route: '/admin/kitchen-orders' },
        { label: 'Manage Orders', icon: 'pi pi-box', route: '/admin/orders' }
      ]
    },
    {
      label: 'Menu',
      items: [
        { label: 'Manage Menu Items', icon: 'pi pi-cog', route: '/admin/menu-items' },
        { label: 'Add Menu Item', icon: 'pi pi-plus-circle', route: '/admin/menu-items/add' }
      ]
    },
    {
      label: 'Kitchen',
      items: [
        { label: 'Manage Customer Orders', icon: 'pi pi-check-square', route: '/admin/kitchen-orders' },
        { label: 'Update Available Dishes', icon: 'pi pi-refresh', route: '/admin/kitchen-orders/manage-available-menu' }
      ]
    },
    {
      label: 'Employees',
      items: [
        { label: 'Manage Employees', icon: 'pi pi-user-edit', route: '/admin/employees' },
        { label: 'Add Employee', icon: 'pi pi-user-plus', route: '/admin/employees/add' }
      ]
    },
    {
      label: 'Reports',
      items: [
        { label: 'Manage Payments', icon: 'pi pi-dollar', route: '/admin/revenue' },
        { label: 'Payment Statistics', icon: 'pi pi-chart-bar', route: '/admin/revenue/statistic' },
        { label: 'Export Reports', icon: 'pi pi-file', route: '/admin/revenue/export' }
      ]
    }
  ];
  
  
  ngOnInit() {
    const role = localStorage.getItem('role');
    this.role = role!;
  
    if (this.role === 'Quản lý') {
      this.items = this.items.filter(item => item.label !== 'Kitchen');
    }
    
    if (this.role === 'Nhân viên bếp') {
      this.items = this.items.filter(item => item.label === 'Home' || item.label === 'Kitchen');
    }
    
    if (this.role === 'Bồi bàn') {
      this.items = this.items.filter(item => item.label === 'Home' || item.label === 'Orders');
    }
    
  }
  
}
