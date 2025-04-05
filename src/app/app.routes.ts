import { Routes } from '@angular/router';
import { HomeComponent } from './features/customer/pages/home/home.component';
import { EntryComponent } from './features/auth/entry/entry.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/admin/pages/dashboard/dashboard.component';

import { authGuard } from './core/guards/auth.guard';
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

export const routes: Routes = [
  {path: 'entry', component: EntryComponent},
  {path: 'home', component: HomeComponent, canActivate: [authGuard]}, 
  // {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'admin', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'menu-items', component: ManageMenuItemsComponent },
      { path: 'menu-items/add', component: AddMenuItemComponent },
      { path: 'menu-items/update/:id', component: UpdateMenuItemComponent },
      { path: 'employees', component: ManageEmployeesComponent },
      { path: 'employees/add', component: AddEmployeeComponent },
      { path: 'kitchen-orders', component: ManageKitchenOrdersComponent },
      { path: 'kitchen-orders/manage-available-menu', component: ManageAvailableMenuComponent },
      { path: 'orders', component: ManageOrdersComponent },
      { path: 'invoice/:orderId', component: InvoiceComponent },
      { path: 'revenue', component: RevenueComponent },
      { path: 'revenue/statistic', component: RevenueStatisticComponent },
      { path: 'revenue/export', component: RevenueExportComponent },
    ]
  }
];
