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

  // Get all articles
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}`);
  }

  // Get a specific article by ID
  getArticleById(articleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${articleId}`);
  }

  // Like an article
  likeArticle(articleId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${articleId}/like`, { userId });
  }

  // Dislike an article
  dislikeArticle(articleId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${articleId}/dislike`, { userId });
  }

  // getPublishedArticlesByAuthor(authorId: string): Observable<Article[]> {
  //   return this.http.get<Article[]>(`${this.apiUrl}/published/author/${authorId}`);
  // } 


  getArticlesByAuthor(authorId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/author/${authorId}`);

  }
  // getAllPublishedArticles(): Observable<Article[]> {
  //   return this.http.get<Article[]>(`${this.apiUrl}/published`);
  // }


  deleteArticle(articleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${articleId}`);
  }

  
  publishArticle(articleId: string, userId: string): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/${articleId}/publish`, { userId });
  }
  
}
