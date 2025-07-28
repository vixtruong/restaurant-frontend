import { Routes } from '@angular/router';
import { HomeComponent } from './features/customer/pages/home/home.component';
import { EntryComponent } from './features/auth/entry/entry.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/admin/pages/dashboard/dashboard.component';

import { LayoutComponent } from './features/admin/layout/layout.component';
import { ManageMenuItemsComponent } from './features/admin/pages/manage-menu-items/manage-menu-items.component';
import { AddMenuItemComponent } from './features/admin/pages/add-menu-item/add-menu-item.component';
import { UpdateMenuItemComponent } from './features/admin/pages/update-menu-item/update-menu-item.component';
import { ManageEmployeesComponent } from './features/admin/pages/manage-employees/manage-employees.component';
import { AddEmployeeComponent } from './features/admin/pages/add-employee/add-employee.component';
import { ManageKitchenOrdersComponent } from './features/admin/pages/manage-kitchen-orders/manage-kitchen-orders.component';
import { ManageAvailableMenuComponent } from './features/admin/pages/manage-available-menu/manage-available-menu.component';
import { ManageOrdersComponent } from './features/admin/pages/manage-orders/manage-orders.component';
import { InvoiceComponent } from './features/admin/pages/invoice/invoice.component';
import { RevenueComponent } from './features/admin/pages/revenue/revenue.component';
import { RevenueStatisticComponent } from './features/admin/pages/revenue-statistic/revenue-statistic.component';
import { RevenueExportComponent } from './features/admin/pages/revenue-export/revenue-export.component';
import { authGuard } from './core/guards/auth.guard';
import { ManageTableComponent } from './features/admin/pages/manage-table/manage-table.component';

export const routes: Routes = [
  {path: 'entry', component: EntryComponent},
  {path: 'home', component: HomeComponent, canActivate: [authGuard], data: { roles: ['Customer']} }, 
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['Quản lý', 'Nhân viên bếp', 'Bồi bàn'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { roles: ['Quản lý', 'Nhân viên bếp', 'Bồi bàn']} },
      { path: 'menu-items', component: ManageMenuItemsComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'menu-items/add', component: AddMenuItemComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'menu-items/update/:id', component: UpdateMenuItemComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'employees', component: ManageEmployeesComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'employees/add', component: AddEmployeeComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'kitchen-orders', component: ManageKitchenOrdersComponent, canActivate: [authGuard], data: { roles: ['Quản lý', 'Nhân viên bếp', 'Bồi bàn']} },
      { path: 'kitchen-orders/manage-available-menu', component: ManageAvailableMenuComponent, canActivate: [authGuard], data: { roles: ['Quản lý', 'Nhân viên bếp']} },
      { path: 'orders', component: ManageOrdersComponent, canActivate: [authGuard], data: { roles: ['Quản lý', 'Bồi bàn']} },
      { path: 'invoice/:orderId', component: InvoiceComponent, canActivate: [authGuard], data: { roles: ['Quản lý', 'Bồi bàn']} },
      { path: 'revenue', component: RevenueComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'revenue/statistic', component: RevenueStatisticComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'revenue/export', component: RevenueExportComponent, canActivate: [authGuard], data: { roles: ['Quản lý']} },
      { path: 'tables', component: ManageTableComponent, canActivate: [authGuard], data: { roles: ['Quản lý'] } }
    ],
  }
];
