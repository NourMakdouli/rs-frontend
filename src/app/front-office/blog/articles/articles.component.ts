// articles.component.ts

import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/core/models/article';
import { ArticleService } from 'src/app/core/services/article.service';
import { Tag } from 'src/app/core/models/tag';
import { TagsService } from 'src/app/core/services/tags.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  featuredArticle: Article | null = null;
  nonFeaturedArticles: Article[] = [];
  searchTerm: string = '';
  tags: Tag[] = [];
  visibleTags: Tag[] = [];
  showAllTags: boolean = false;
  constructor(
    private articleService: ArticleService,
    private tagsService: TagsService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.loadTags();
  }
  updateVisibleTags(): void {
    this.visibleTags = this.showAllTags ? this.tags : this.tags.slice(0, 6);
  }

  toggleTags(): void {
    this.showAllTags = !this.showAllTags;
    this.updateVisibleTags();
  }

  loadArticles(): void {
    this.articleService.getAllArticles().subscribe((data: Article[]) => {
      // Filter out drafts
      this.articles = data.filter((article) => !article.isDraft);

      // Select featured article (most liked article of the month)
      this.selectFeaturedArticle();

      // Set non-featured articles
      this.nonFeaturedArticles = this.articles.filter(
        (article) => article._id !== this.featuredArticle?._id
      );
    });
  }

  selectFeaturedArticle(): void {
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter articles from the current month
    const articlesThisMonth = this.articles.filter((article) => {
      const articleDate = new Date(article.createdAt);
      return (
        articleDate.getMonth() === currentMonth &&
        articleDate.getFullYear() === currentYear
      );
    });

    // Find the article with the most likes
    if (articlesThisMonth.length > 0) {
      this.featuredArticle = articlesThisMonth.reduce((prev, current) => {
        return prev.likes.length > current.likes.length ? prev : current;
      });
    } else {
      // If no articles this month, pick the most liked overall
      if (this.articles.length > 0) {
        this.featuredArticle = this.articles.reduce((prev, current) => {
          return prev.likes.length > current.likes.length ? prev : current;
        });
      } else {
        this.featuredArticle = null;
      }
    }
  }

 
  searchArticles(): void {
    if (this.searchTerm.trim()) {
      this.articleService.searchArticles(this.searchTerm).subscribe(
        (data: Article[]) => {
          this.articles = data.filter((article) => !article.isDraft);
          this.selectFeaturedArticle();
          this.nonFeaturedArticles = this.articles.filter(
            (article) => article._id !== this.featuredArticle?._id
          );
        },
        () => {
          this.articles = [];
          this.featuredArticle = null;
          this.nonFeaturedArticles = [];
        }
      );
    } else {
      this.loadArticles();
    }
  }
  loadTags(): void {
    this.tagsService.getTags().subscribe({
      next:(tags: Tag[]) => {
        this.tags = tags;
        this.updateVisibleTags();
      },
      error:(error) => {
        console.error('Error loading tags:', error);
      }
  });
  }

  filterByTag(tag: Tag): void {
    this.articleService.getArticlesByTag(tag._id).subscribe({
      next:(data: Article[]) => {
        this.articles = data.filter((article) => !article.isDraft);
        // Re-select featured article and non-featured articles
        this.selectFeaturedArticle();
        this.nonFeaturedArticles = this.articles.filter(
          (article) => article._id !== this.featuredArticle?._id
        );
      },
      error:(error) => {
        console.error('Error filtering articles by tag:', error);
        this.articles = [];
        this.featuredArticle = null;
        this.nonFeaturedArticles = [];
      }
  });
  }
}
