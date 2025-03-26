import { Routes } from '@angular/router';
import { HomeComponent } from './features/customer/home/home.component';
import { EntryComponent } from './features/customer/entry/entry.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {path: 'entry', component: EntryComponent},
  {path: 'home', component: HomeComponent, canActivate: [authGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];
