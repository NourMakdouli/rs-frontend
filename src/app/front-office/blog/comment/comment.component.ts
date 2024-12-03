import { Component, Input } from '@angular/core';
import { articleComment, CreateCommentDto } from 'src/app/core/models/comment';
import { CommentService } from 'src/app/core/services/comment.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment: articleComment;
  @Input() userId: string;

  showReplyForm = false;
  replyContent: string = '';

  constructor(
    private commentService: CommentService,
  ) {}

  toggleReplyForm(): void {
    this.showReplyForm = !this.showReplyForm;
  }
  

  submitReply(): void {
    if (this.replyContent.trim()) {
      const replyData: CreateCommentDto = {
        articleId: this.comment.article,
        content: this.replyContent,
        userId: this.userId,
        parentCommentId: this.comment._id,
      };

      this.commentService.createComment(replyData).subscribe((createdReply) => {
        console.log("the comment",createdReply);

        if (!this.comment.replies) {
          this.comment.replies = [];
          console.log(this.comment.replies)
        }
        this.comment.replies.push(createdReply);
        this.replyContent = '';
        this.showReplyForm = false;
      });
    }
  }

likeComment(): void {
  if (this.userId) {
    this.commentService.likeComment(this.comment._id, this.userId).subscribe({

  
      next:(updatedComment) => {
        this.comment.likes = updatedComment.likes;
        this.comment.dislikes = updatedComment.dislikes;
      },
      error:(error) => {
        console.error('Error liking comment:', error);
        alert('An error occurred while liking the comment.');
      }
  });
  }
}

dislikeComment(): void {
  if (this.userId) {
    this.commentService.dislikeComment(this.comment._id, this.userId).subscribe({
      next:(updatedComment) => {
        this.comment.likes = updatedComment.likes;
        this.comment.dislikes = updatedComment.dislikes;
      },
      error:(error) => {
        console.error('Error disliking comment:', error);
        alert('An error occurred while disliking the comment.');
      }
  });
  }
}

}
