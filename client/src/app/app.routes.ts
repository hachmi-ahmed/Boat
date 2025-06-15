import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import {NoAuthGuard} from "./guards/no-auth.guard";
import { BoatDetailComponent } from './components/boats/boat-detail.component';

export const routes: Routes = [
  { path: 'overview', canActivate: [AuthGuard], loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', canActivate: [NoAuthGuard], loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [NoAuthGuard], loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'denied', loadComponent: () => import('./components/denied.component').then(m => m.AccessDeniedComponent) },
  { path: 'boats/:boatId', component: BoatDetailComponent },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/user/user.routes').then(m => m.USER_ROUTES)
  },
  { path: '**', redirectTo: 'overview' }
];
