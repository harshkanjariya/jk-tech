import {CanActivateFn, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PublicPostsComponent} from './public-posts/public-posts.component';
import {PostDetailComponent} from './post-detail/post-detail.component';

const isAuthenticated: CanActivateFn = () => {
  return !!localStorage.getItem('token');
};

export const routes: Routes = [
  { path: '', component: PublicPostsComponent },
  { path: 'post/:id', component: PostDetailComponent },
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [isAuthenticated]
  }
];
