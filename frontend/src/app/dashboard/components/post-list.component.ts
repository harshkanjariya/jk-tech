import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {PostCardComponent} from '../../components/post-card/post-card.component';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {EditorComponent} from '@tinymce/tinymce-angular';
import {TINYMCE_CONFIG} from '../../config/tinymce.config';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PostCardComponent,
    MatIcon,
    MatLabel,
    MatFormField,
    MatFabButton,
    MatInput,
    MatButton,
    EditorComponent,
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  newPost = {title: '', content: ''};
  creatingPost = false; // ✅ Controls form visibility

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.apiService.get<any>('posts/my').subscribe({
      next: (data: any) => (this.posts = data.posts),
      error: (error: any) => console.error('Error fetching posts:', error)
    });
  }

  createPost(): void {
    if (!this.newPost.title || !this.newPost.content) return;

    const postData = {...this.newPost};

    this.apiService.post<any>('posts', postData).subscribe({
      next: (response: any) => {
        console.log('Post created:', response);
        this.newPost = {title: '', content: ''};
        this.fetchPosts();
        this.creatingPost = false; // ✅ Hide form after post creation
      },
      error: (error: any) => console.error('Error creating post:', error)
    });
  }

  openPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }

  deletePost(postId: number): void {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.apiService.delete(`posts/${postId}`).subscribe({
      next: () => {
        console.log('Post deleted:', postId);
        this.posts = this.posts.filter(post => post.id !== postId);
      },
      error: (error: any) => console.error('Error deleting post:', error)
    });
  }

  protected readonly TINYMCE_CONFIG = TINYMCE_CONFIG;
}
