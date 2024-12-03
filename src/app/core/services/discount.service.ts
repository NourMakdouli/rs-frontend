import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Discount } from '../models/discount';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private baseUrl = `${environment.API_URL}/discounts`;

  constructor(private http: HttpClient) {}
// discount.service.ts
getDiscountsByStoreWithFilters(storeId: string, filters: any): Observable<Discount[]> {
  let params = new HttpParams();
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      params = params.append(key, filters[key]);
    }
  }
  return this.http.get<Discount[]>(`${this.baseUrl}/store/${storeId}`, { params });
}

  
  // Get all discounts
  getAllDiscounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  getDiscounts(filterParams?: any): Observable<Discount[]> {
    let params = new HttpParams();
    if (filterParams) {
      Object.keys(filterParams).forEach((key) => {
        if (filterParams[key]) {
          params = params.append(key, filterParams[key]);
        }
      });
    }
    return this.http.get<Discount[]>(`${this.baseUrl}`, { params });
  }
  // Get discount by ID
  getDiscountById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new discount
  createDiscount(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(`${this.baseUrl}`, discount);
  }

  updateDiscount(discountId: string, discountData: Partial<Discount>): Observable<Discount> {
    return this.http.patch<Discount>(`${this.baseUrl}/${discountId}`, discountData);
  }
  // Delete a discount
  deleteDiscount(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getDiscountsByStore(storeId: string): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.baseUrl}/store/${storeId}`);
  }
}
