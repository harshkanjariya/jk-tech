import {CanActivateFn, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';

const isAuthenticated: CanActivateFn = () => {
  return !!localStorage.getItem('token');
};

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [isAuthenticated]
  }
];
