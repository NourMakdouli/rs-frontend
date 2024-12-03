import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/core/models/article';
import { articleComment, CreateCommentDto } from 'src/app/core/models/comment';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { Tag } from 'src/app/core/models/tag';
import { TagsService } from 'src/app/core/services/tags.service';
import { BlogService } from 'src/app/core/services/blog.service';
import { Blog } from 'src/app/core/models/blog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  article: Article | null;
  currentBlog: Blog | null;
  comments: articleComment[] = [];
  similarPosts: Article[] = [];
  articleId: string;
  tags: Tag[] = [];

  userId: string;
  newCommentContent: string = '';

  private routeSubscription: Subscription;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private tagsService: TagsService
  ) {}

  ngOnInit(): void {
    // Subscribe to the current user
    this.authService.currentUser.subscribe({
      next: (user) => {
        if (user) {
          this.userId = user._id;
        }
      }
    });

    // Subscribe to route parameter changes
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.articleId = params['id'];
      this.initializeComponent(); // Load data whenever the route changes
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  initializeComponent(): void {
    // Reset component properties
    this.article = null;
    this.currentBlog = null;
    this.comments = [];
    this.similarPosts = [];
    this.tags = [];
    this.newCommentContent = '';

    // Load article details and related data
    this.loadArticleDetails(this.articleId);
    this.loadComments(this.articleId);
  }

  loadStoreDetails(id: string): void {
    this.blogService.getBlogByOwner(id).subscribe({
      next: (blog) => {
        this.currentBlog = blog;
      },
      error: (error) => {
        console.error('Error fetching blog:', error);
      }
    });
  }

  loadArticleDetails(id: string): void {
    this.articleService.getArticleById(id).subscribe(
      (article: Article) => {
        this.article = article;
        this.loadStoreDetails(this.article.author._id);
        console.log('The article:', this.article);

        if (this.article.tags?.length) {
          this.fetchTags();
        }
        this.loadSimilarPosts();
      },
      (error) => {
        console.error('Error loading article details:', error);
        // Handle error (e.g., navigate to a not-found page)
      }
    );
  }

  navigateToArticle(articleId: string): void {
    this.router.navigate(['/article-details', articleId]);
  }

  loadComments(articleId: string): void {
    this.commentService.getCommentsByArticle(articleId).subscribe(
      (comments: articleComment[]) => {
        this.comments = comments;
        console.log('Comments:', this.comments);
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }

  fetchTags(): void {
    // Clear existing tags to prevent duplicates
    this.tags = [];
    const tagIds: string[] = this.article?.tags ?? []; // Use optional chaining
    tagIds.forEach((tagId: string) => {
      this.tagsService.getTagById(tagId).subscribe((tag: Tag) => {
        this.tags.push(tag);
      });
    });
  }
  

  submitComment(): void {
    if (this.newCommentContent.trim()) {
      const commentData: CreateCommentDto = {
        articleId: this.articleId,
        content: this.newCommentContent,
        userId: this.userId
      };

      this.commentService.createComment(commentData).subscribe(
        (createdComment) => {
          this.comments.push(createdComment);
          this.newCommentContent = '';
        },
        (error) => {
          console.error('Error submitting comment:', error);
        }
      );
    }
  }

  likeArticle(): void {
    if (this.userId && this.article) {
      this.articleService.likeArticle(this.article._id, this.userId).subscribe(
        (updatedArticle: Article) => {
          this.article = updatedArticle;
          this.toastr.success('You liked this article!');
        },
        (error) => {
          console.error('Error liking article:', error);
        }
      );
    }
  }

  dislikeArticle(): void {
    if (this.userId && this.article) {
      this.articleService.dislikeArticle(this.article._id, this.userId).subscribe(
        (updatedArticle: Article) => {
          this.article = updatedArticle;
          this.toastr.success('You disliked this article.');
        },
        (error) => {
          console.error('Error disliking article:', error);
        }
      );
    }
  }

  loadSimilarPosts(): void {
    this.articleService.getSimilarArticles(this.articleId).subscribe(
      (articles: Article[]) => {
        this.similarPosts = articles;
        console.log('Similar posts:', this.similarPosts);
      },
      (error) => {
        console.error('Error loading similar articles:', error);
      }
    );
  }
}
