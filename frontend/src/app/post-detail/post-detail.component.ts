import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import {EditorOptions} from 'tinymce';
import {TINYMCE_CONFIG} from '../config/tinymce.config';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    EditorComponent
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: any;
  isAuthor: boolean = false;
  editing: boolean = false;
  updatedPost = { title: '', content: '' };

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.apiService.get(`posts/${postId}`).subscribe({
        next: (data) => {
          this.post = data;
          const token = localStorage.getItem('token');
          if (token) {
            const decodedToken: any = jwtDecode(token);
            const loggedInUserId = decodedToken.id;
            this.isAuthor = this.post.author?.id === loggedInUserId;
          }
        },
        error: (error) => console.error('Error fetching post:', error)
      });
    }
  }

  enableEditing(): void {
    this.editing = true;
    this.updatedPost = { title: this.post.title, content: this.post.content };
  }

  saveChanges(): void {
    this.apiService.patch(`posts/${this.post.id}`, this.updatedPost).subscribe({
      next: (updatedPost) => {
        this.post = updatedPost;
        this.editing = false;
      },
      error: (error) => console.error('Error updating post:', error)
    });
  }

  protected readonly TINYMCE_CONFIG = TINYMCE_CONFIG;
}
