// order.component.ts
import { Component } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {

 // createOrder(cartItems: CartItem[], totalPrice: number): Observable<any> {}

  constructor(private orderService: OrderService, private router: Router) {

    
  }

}
