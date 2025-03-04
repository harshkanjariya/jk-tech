import {booleanAttribute, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, MatIconButton, MatIcon],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() post: any;
  @Input() onClick: ((id: number) => void) = () => {};
  @Input() onDelete: ((id: number) => void) = () => {};
  @Input({transform: booleanAttribute}) showDeleteButton: boolean = false;

  deletePost(event: Event, postId: number) {
    event.stopPropagation(); // ✅ Prevent click from triggering `onClick`
    this.onDelete(postId);
  }
}
