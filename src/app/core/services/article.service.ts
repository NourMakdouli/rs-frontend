// src/app/services/article.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.API_URL}/articles`;

  constructor(private http: HttpClient) {}

  // Create a new article
  createArticle(articleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, articleData);
  }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}`);
  }

  searchArticles(searchTerm: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/search`, {
      params: { query: searchTerm }
    });
  }
  getArticleById(articleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${articleId}`);
  }
  getSimilarArticles(articleId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/${articleId}/similar`);
  }
  likeArticle(articleId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${articleId}/like`, { userId });
  }

  dislikeArticle(articleId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${articleId}/dislike`, { userId });
  }

  getArticlesByTag(tagId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/tag/${tagId}`);
  }
  getArticlesByAuthor(authorId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/author/${authorId}`);

  }

  deleteArticle(articleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${articleId}`);
  }

  
  publishArticle(articleId: string, userId: string): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/${articleId}/publish`, { userId });
  }
  
}
