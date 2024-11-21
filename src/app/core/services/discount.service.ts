import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private baseUrl = `${environment.API_URL}/discounts`;

  constructor(private http: HttpClient) {}

  // Get all discounts
  getAllDiscounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get discount by ID
  getDiscountById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new discount
  createDiscount(discountData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, discountData);
  }

  // Update an existing discount
  updateDiscount(id: string, discountData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, discountData);
  }

  // Delete a discount
  deleteDiscount(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
