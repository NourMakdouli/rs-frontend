// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartService } from './cart.service';
import { CartItem } from '../models/cartItem';
import { Order, UpdateOrderStatusDto } from '../models/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.API_URL}/orders`;

  constructor(private http: HttpClient, private cartService: CartService) {}

  createOrder(cartItems: CartItem[], totalPrice: number, user: string): Observable<Order> {
    const input = {
      cartItems: cartItems,
      totalPrice: totalPrice,
      user: user,
      location: "location"
    };
    return this.http.post<Order>(this.apiUrl, input);
  }
  
  getPendingOrderByUser(userId: string): Observable<Order | null> {
    return this.http.get<Order | null>(`${this.apiUrl}/pending/${userId}`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, updateOrderStatusDto);
  }

  deleteOrder(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
  getOrdersByStore(storeId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByStore/${storeId}`);
  }
  confirmOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/confirm`, {});
  }
  



}
