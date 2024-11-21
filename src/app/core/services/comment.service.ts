import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { articleComment, CreateCommentDto } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.API_URL}/comments`;

  constructor(private http: HttpClient) {}

  // Create a new comment
  createComment(commentData: CreateCommentDto): Observable<articleComment> {
    return this.http.post<articleComment>(`${this.apiUrl}`, commentData);
  }

  // Get a specific comment with its replies
  getCommentWithReplies(commentId: string): Observable<articleComment> {
    return this.http.get<articleComment>(`${this.apiUrl}/${commentId}`);
  }

  // Get all comments for a specific article
  getCommentsByArticle(articleId: string): Observable<articleComment[]> {
    return this.http.get<articleComment[]>(`${this.apiUrl}/${articleId}/getCommentsByArticle`);
  }

  // Get a specific comment by ID
  findCommentById(commentId: string): Observable<articleComment> {
    return this.http.get<articleComment>(`${this.apiUrl}/${commentId}`);
  }

  // Delete a comment
  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }

  // Like a comment
  likeComment(commentId: string, userId: string): Observable<articleComment> {
    return this.http.post<articleComment>(`${this.apiUrl}/${commentId}/like`, { userId });
  }

  // Dislike a comment
  dislikeComment(commentId: string, userId: string): Observable<articleComment> {
    return this.http.post<articleComment>(`${this.apiUrl}/${commentId}/dislike`, { userId });
  }
}
