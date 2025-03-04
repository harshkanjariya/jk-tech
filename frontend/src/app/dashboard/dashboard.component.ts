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
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
