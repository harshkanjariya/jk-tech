import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {PostListComponent} from './components/post-list.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, PostListComponent]
})
export class DashboardComponent {
  isLoggedIn = false;

  constructor(private router: Router) {}

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
