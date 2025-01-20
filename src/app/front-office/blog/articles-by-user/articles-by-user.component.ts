import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Article } from 'src/app/core/models/article';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-articles-by-user',
  templateUrl: './articles-by-user.component.html',
  styleUrls: ['./articles-by-user.component.css']
})
export class ArticlesByUserComponent implements OnInit {
navigateToAddArticle() {
throw new Error('Method not implemented.');
}
  articles: Article[] = [];
  drafts: Article[] = [];
  published: Article[] = [];
  userId: string;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue?._id || '';
    this.articleService.getArticlesByAuthor(this.userId).subscribe((data: Article[]) => {
      this.articles = data;
      this.drafts = this.articles.filter(article => article.isDraft === true);
      this.published = this.articles.filter(article => article.isDraft === false);
    });
  }

  deleteArticle(articleId: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: "Voulez-vous vraiment supprimer cet article ? Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.articleService.deleteArticle(articleId).subscribe(() => {
          this.toastr.success('Article supprimé avec succès');
          // Remove the article from the articles, drafts, and published lists
          this.articles = this.articles.filter(article => article._id !== articleId);
          this.drafts = this.drafts.filter(article => article._id !== articleId);
          this.published = this.published.filter(article => article._id !== articleId);
          Swal.fire(
            'Supprimé !',
            "L'article a été supprimé.",
            'success'
          );
        });
      }
    });
  }
  
  publishArticle(articleId: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: "Voulez-vous vraiment publier cet article ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, publiez-le !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.articleService.publishArticle(articleId, this.userId).subscribe((updatedArticle: Article) => {
          this.toastr.success('Article publié avec succès');
          // Move the article from drafts to published
          this.drafts = this.drafts.filter(article => article._id !== articleId);
          this.published.push(updatedArticle);
  
          Swal.fire(
            'Publié !',
            "L'article a été publié.",
            'success'
          );
        });
      }
    });
  }
}
