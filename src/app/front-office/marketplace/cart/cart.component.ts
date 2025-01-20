import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cartItem';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { Order } from 'src/app/core/models/order';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: CartItem[] = [];
  cartTotal = 0;
  tokenBalance = 0; 
  tokenInput = 0;  
  private userId: string;
  private cartSub: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.cartProducts = this.cartService.getItems();
    this.calculateCartTotal();
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.userId = user._id;

        this.tokenBalance = user.tokenBalance || 0;

        this.cartSub = this.cartService.cartUpdated.subscribe(() => {
          this.cartProducts = this.cartService.getItems();
          this.calculateCartTotal();
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  calculateCartTotal() {
    const originalTotal = this.cartProducts.reduce((total, item) => total + item.total, 0);
    this.cartTotal = originalTotal - this.tokenInput;
  }

  onTokenInputChange(event: any) {
    const value = Number(event.target.value);

    
    if (value > this.tokenBalance) {
      this.tokenInput = this.tokenBalance; 
    } else if (value < 0) {
      this.tokenInput = 0; 
    } else {
      this.tokenInput = value;
    }

    this.calculateCartTotal(); 
  }

  removeFromCart(product: CartItem) {
    Swal.fire({
      title: 'Are you sure you want to remove this item from the cart?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
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
      if (this.tokenInput > this.tokenBalance) {
        alert('You cannot use more tokens than you have!');
        return;
      }
      this.validateCart().then((isValid) => {
        if (isValid) {
          const cartItems = this.cartProducts;
          const totalPrice = this.cartTotal;

          this.orderService.createOrder(cartItems, totalPrice, this.userId).subscribe({
            next: (response: Order) => {
              localStorage.setItem('cart_total', JSON.stringify(this.cartTotal));
              console.log('Order created:', response);
              this.router.navigate(['/marketplace/checkout', response._id]);
            },
            error: (error: any) => {
              console.error('Error creating order:', error);
              Swal.fire('Error', 'There was an issue creating your order. Please try again.', 'error');
            },
            complete: () => {
              console.log('Order creation process completed.');
            }
          });
        } else {
        }
      }).catch(() => {
        Swal.fire('Error', 'Unable to validate cart at this time. Please try again later.', 'error');
      });
    } else {
      Swal.fire('You need to be logged in to proceed to checkout!');
      this.router.navigate(['/login']);
    }
  }

  validateCart(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const cartItems = this.cartProducts;
      const validationRequests = cartItems.map((item) =>
        this.productService.getProductById(item.id)
      );

      forkJoin(validationRequests).subscribe({
        next: (products: Product[]) => {
          let isValid = true;
          let messages: string[] = [];

          products.forEach((product, index) => {
            const cartItem = cartItems[index];

            if (product.numberOfPieces === 0) {
              messages.push(`"${product.title}" is now out of stock and has been removed from your cart.`);
              this.cartService.removeFromCart(cartItem);
              isValid = false;
            } else if (cartItem.quantity > product.numberOfPieces) {
              cartItem.quantity = product.numberOfPieces;
              cartItem.total = cartItem.quantity * cartItem.price;
              messages.push(`The quantity of "${product.title}" has been adjusted to ${product.numberOfPieces} due to stock limitations.`);
              isValid = false;
            }
          });

          if (!isValid) {
            localStorage.setItem('cart', JSON.stringify(this.cartService.cartItems));
            this.cartService.cartUpdated.next(this.cartService.getCartCount());
            Swal.fire({
              title: 'Cart Updated',
              html: messages.join('<br/>'),
              icon: 'info',
              confirmButtonText: 'Review Cart'
            }).then(() => {
              this.calculateCartTotal();
              resolve(false);
            });
          } else {
            resolve(true);
          }
        },
        error: (error) => {
          console.error('Error validating cart:', error);
          Swal.fire('Error', 'Unable to validate cart at this time. Please try again later.', 'error');
          reject(false);
        }
      });
    });
  }

  updateQuantity(product: CartItem, modifier: number) {
    const newQuantity = product.quantity + modifier;

    this.productService.getProductById(product.id).subscribe({
      next: (latestProduct: Product) => {
        const availableStock = latestProduct.numberOfPieces;

        if (newQuantity > 0 && newQuantity <= availableStock) {
          product.quantity = newQuantity;
          product.total = product.quantity * product.price;
          localStorage.setItem('cart', JSON.stringify(this.cartService.cartItems));
          this.cartService.cartUpdated.next(this.cartService.getCartCount());
          this.calculateCartTotal();
        } else if (newQuantity > availableStock) {
          Swal.fire('Error', `You cannot add more than ${availableStock} units of this product.`, 'error');
        } else if (newQuantity <= 0) {
          this.removeFromCart(product);
        }
      },
      error: (error: any) => {
        console.error('Error fetching product data:', error);
        Swal.fire('Error', 'Unable to update quantity at this time. Please try again later.', 'error');
      }
    });
  }
}
