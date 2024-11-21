import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/core/models/article';
import { articleComment, CreateCommentDto } from 'src/app/core/models/comment';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit {
  article: Article;
  comments: articleComment[] = [];
  similarPosts: Article[] = [];
  articleId: string;
  userId: string;
  newCommentContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id') || "";
    this.loadArticleDetails(this.articleId);
    this.userId = this.authService.currentUserValue?._id || "";
    this.loadComments(this.articleId);
  }

  loadArticleDetails(id: string): void {
    this.articleService.getArticleById(id).subscribe((article: Article) => {
      this.article = article;
      this.loadSimilarPosts();
    });
  }

  loadComments(articleId: string): void {
    this.commentService.getCommentsByArticle(articleId).subscribe((comments: articleComment[]) => {
      this.comments = comments; 
      console.log(this.comments);
    });
  }

  submitComment(): void {
    if (this.newCommentContent.trim()) {
      const commentData: CreateCommentDto = {
        articleId: this.articleId,
        content: this.newCommentContent,
        userId: this.userId,
      };

      this.commentService.createComment(commentData).subscribe((createdComment) => {
        this.comments.push(createdComment);
        this.newCommentContent = '';
      });
    }
  }

  likeArticle(): void {
    if (this.userId) {
      this.articleService.likeArticle(this.article._id, this.userId).subscribe((updatedArticle: Article) => {
        this.article = updatedArticle;
        this.toastr.success('You liked this article!');
      });
    }
  }

  dislikeArticle(): void {
    if (this.userId) {
      this.articleService.dislikeArticle(this.article._id, this.userId).subscribe((updatedArticle: Article) => {
        this.article = updatedArticle;
        this.toastr.success('You disliked this article.');
      });
    }
  }

  loadSimilarPosts(): void {
    // Logic for loading similar posts
  }
}
