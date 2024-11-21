import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/core/models/cartItem';
import { CartService } from 'src/app/core/services/cart.service';
import { Order } from 'src/app/core/models/order';

@Component({
  selector: 'app-off-canvas-content',
  templateUrl: './off-canvas-content.component.html',
  styleUrls: ['./off-canvas-content.component.css']
})
export class OffCanvasContentComponent implements OnInit, OnDestroy {
  cartProducts: CartItem[] = [];
  cartTotal = 0;
  private userId: string;
  private cartSub: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.cartProducts = this.cartService.getItems();
    this.calculateCartTotal();
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.userId = user._id;
      }
    });
    this.cartSub = this.cartService.cartUpdated.subscribe(() => {
      this.cartProducts = this.cartService.getItems();
      this.calculateCartTotal();
    });
  }

  ngOnDestroy() {
    if(this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  calculateCartTotal() {
    this.cartTotal = this.cartProducts.reduce((total, item) => total + item.total, 0);
  }

  removeFromCart(product: CartItem) {
    Swal.fire({
      title: 'Are you sure you want to remove this item from the cart?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove item'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(product);
        Swal.fire('Removed', 'Item has been removed from the cart.', 'success');
      }
    });
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure you want to clear the cart?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear cart',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire('Cleared', 'Cart has been cleared successfully.', 'success');
      }
    });
  }

  checkout() {

    if (this.authService.isAuthenticated) {
      const cartItems = this.cartProducts;
      const totalPrice = this.cartTotal;
  
      this.orderService.createOrder(cartItems, totalPrice, this.userId).subscribe({
        next: (response: Order) => {  // Assuming `Order` is the return type
          localStorage.setItem('cart_total', JSON.stringify(this.cartTotal));
          console.log('Order created:', response);
          this.router.navigate(['/marketplace/checkout',response._id]);
        },
        error: (error: any) => {  // Be specific if possible, e.g., `HttpErrorResponse`
          console.error('Error creating order:', error);
          Swal.fire('Error', 'There was an issue creating your order. Please try again.', 'error');
        },
        complete: () => {
          console.log('Order creation process completed.');
        }
      });
    } else {
      Swal.fire('You need to be logged in to proceed to checkout!');
      this.router.navigate(['/login']);
    }
  }


}
