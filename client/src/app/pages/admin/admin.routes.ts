import { Routes } from '@angular/router';
import {DashboardComponent} from "../../components/dashboard/dashboard.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../../components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.AdminProfileComponent)
  }
];
