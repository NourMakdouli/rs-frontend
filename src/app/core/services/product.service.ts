import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.API_URL}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  isDiscountApplied(productId: string): Observable<{ isDiscountApplied: boolean }> {
    return this.http.get<{ isDiscountApplied: boolean }>(`${this.apiUrl}/${productId}/is-discount-applied`);
  }
  getEffectivePrice(productId: string): Observable<{ isDiscounted: boolean, effectivePrice: number, discountId: string | null }> {
    return this.http.get<{ isDiscounted: boolean, effectivePrice: number, discountId: string | null }>(`${this.apiUrl}/${productId}/effective-price`);
  }
  createProduct(product: Product): Observable<{ product: Product, message: string }> {
    return this.http.post<{ product: Product, message: string }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<{ product: Product, message: string }> {
    return this.http.patch<{ product: Product, message: string }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    console.log(id);
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }


  getProductsByStoreId(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/store/${id}`);
  }
  
  
  getProductByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }
  
}
