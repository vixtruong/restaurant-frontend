import { Routes } from '@angular/router';
import { HomeComponent } from './features/customer/pages/home/home.component';
import { EntryComponent } from './features/customer/pages/entry/entry.component';
import { customerGuard } from './core/guards/customer.guard';

export const routes: Routes = [
  {path: 'entry', component: EntryComponent},
  {path: 'home', component: HomeComponent, canActivate: [customerGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];
