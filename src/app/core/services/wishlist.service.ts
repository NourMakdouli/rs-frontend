import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = `${environment.API_URL}/users`;


  constructor(
    private http: HttpClient  ) {}
    getUserFavorites(userId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${userId}/favorites`);
    }
  
    addToFavorites(userId: string, productId: string): Observable<any> {
      return this.http.patch<any>(`${this.apiUrl}/${userId}/favorites`, { productId });
    }
    
  
    addMultipleToFavorites(userId: string, productIds: string[]): Observable<any> {
      return this.http.patch<any>(`${this.apiUrl}/${userId}/favorites/bulk`, { productIds });
    }
  
    removeFromFavorites(userId: string, productId: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${userId}/favorites/${productId}`);
    }
  
    deleteAllFavorites(userId: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${userId}/favorites`);
    }
  

}
