import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {PostCardComponent} from '../components/post-card/post-card.component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-public-posts',
  standalone: true,
  imports: [CommonModule, PostCardComponent, MatButton],
  templateUrl: './public-posts.component.html',
  styleUrls: ['./public-posts.component.scss']
})
export class PublicPostsComponent implements OnInit {
  posts: any[] = [];
  page = 1;
  limit = 5; // Load 5 posts at a time
  loading = false;
  totalPages = 1;
  isLoggedIn = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadPosts();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  loadPosts(): void {
    if (this.loading || this.page > this.totalPages) return;
    this.loading = true;

    this.apiService.get(`posts?page=${this.page}&limit=${this.limit}`).subscribe({
      next: (data: any) => {
        this.posts.push(...data.posts);
        this.totalPages = data.totalPages;
        this.page++;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
  }

  openPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      this.loadPosts();
    }
  }
}
