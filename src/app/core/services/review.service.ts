import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Review, ReviewPerStore } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.API_URL}/reviews`;

  constructor(private http: HttpClient) {}


  createReview(reviewData: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, reviewData);
  }


  updateReviewUpvotes(reviewId: string, upvotes: string[]): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/${reviewId}/upvotes`, { upvotes });
  }
  getReviewsByStore(storeId: string): Observable<ReviewPerStore[]> {
    return this.http.get<ReviewPerStore[]>(`${this.apiUrl}/store/${storeId}`);
  }


  getAllReviews():Observable<Review[]>{
    return this.http.get<Review[]>(`${this.apiUrl}`);
  }

  updateReview(id: string, reviewData: Partial<Review>):Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/${id}`, reviewData);
  }

getReviewById(id:string):Observable<Review> {
  return this.http.get<Review>(`${this.apiUrl}/${id}`);
}


  deleteReview(id: string): Observable<{ status: number; message: string }> {
    return this.http.delete<{ status: number; message: string }>(`${this.apiUrl}/${id}`);
  }
}
