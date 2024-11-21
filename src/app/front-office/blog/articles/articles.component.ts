import { Component } from '@angular/core';
import { Article } from 'src/app/core/models/article';
import { ArticleService } from 'src/app/core/services/article.service';
import { IsDraftFilterPipe } from 'src/app/core/utils/pipes/is-draft-filter.pipe';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent {
  articles: Article[] = [];

  constructor(private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe((data: Article[]) => {
      this.articles = data;
    });
  }
}
