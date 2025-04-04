import { Component, inject } from '@angular/core';
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

  items = [
    {
      label: 'Trang chủ',
      items: [
        { label: 'Dashboard', icon: 'pi pi-home', route: '/admin'}
      ]
    },
    {
      label: 'Đơn hàng',
      items: [
        { label: 'Quản lý đơn hàng', icon: 'pi pi-box', route: '/admin/orders' },
      ]
    },
    {
      label: 'Món ăn',
      items: [
        { label: 'Quản lý món ăn', icon: 'pi pi-cog', route: '/admin/menu-items' },
        { label: 'Thêm món ăn', icon: 'pi pi-plus-circle', route: '/admin/menu-items/add' }
      ]
    },
    {
      label: 'Bếp',
      items: [
        { label: 'Quản lý thực đơn khách đặt', icon: 'pi pi-check-square', route: '/admin/kitchen-orders' },
        { label: 'Cập nhật món ăn', icon: 'pi pi-refresh', route: '/admin/kitchen-orders/manage-available-menu' },
      ]
    },
    // {
    //   label: 'Khách hàng',
    //   items: [
    //     { label: 'Duyệt thực đơn', icon: 'pi pi-eye', route: '/menu' },
    //     { label: 'Gọi món', icon: 'pi pi-phone', route: '/order' },
    //     { label: 'Hủy món chưa xác nhận', icon: 'pi pi-times-circle', route: '/cancel-unconfirmed' },
    //     { label: 'Xem trạng thái đơn hàng', icon: 'pi pi-info-circle', route: '/order/status' },
    //     { label: 'Yêu cầu thanh toán', icon: 'pi pi-credit-card', route: '/order/payment' }
    //   ]
    // },
    {
      label: 'Nhân viên',
      items: [
        { label: 'Quản lý nhân viên', icon: 'pi pi-user-edit', route: '/admin/employees' },
        { label: 'Thêm nhân viên', icon: 'pi pi-user-plus', route: '/admin/employees/add' }
      ]
    },
    {
      label: 'Thống kê',
      items: [
        { label: 'Quản lý thanh toán', icon: 'pi pi-dollar', route: '/admin/revenue' },
        { label: 'Thống kê thanh toán', icon: 'pi pi-chart-bar', route: '/admin/revenue/statistic' },
        { label: 'Xuất thống kê', icon: 'pi pi pi-file', route: '/admin/revenue/export' },
      ]
    }
  ];
  
}
