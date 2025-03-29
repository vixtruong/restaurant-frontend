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

export const routes: Routes = [
  {path: 'entry', component: EntryComponent},
  {path: 'home', component: HomeComponent, canActivate: [authGuard]},
  {path: '', redirectTo: 'admin', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'menu-items/manage', component: ManageMenuItemsComponent },
      { path: 'menu-items/add', component: AddMenuItemComponent },
      { path: 'menu-items/update/:id', component: UpdateMenuItemComponent }
    ]
  }
];
