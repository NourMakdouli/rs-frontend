import { Injectable } from '@angular/core';
import { CartItem } from '../models/cartItem';
import { Subject } from 'rxjs';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  cartUpdated = new Subject<number>();

  constructor(private toastr:ToastrService) {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
    }
  }

  addToCart(product: Product): boolean {
    const existingCartItem = this.cartItems.find(item => item.id === product._id);
  
    const cartQuantity = existingCartItem ? existingCartItem.quantity : 0;
    const newQuantity = cartQuantity + 1;
  
    if (newQuantity > product.numberOfPieces) {
  
      return false;
    }
  
    if (existingCartItem) {
      existingCartItem.quantity = newQuantity;
      existingCartItem.total = existingCartItem.price * existingCartItem.quantity;
    } else {
      const totalPrice = product.fees + product.priceExcludingFees;
      const newCartItem: CartItem = {
        id: product._id,
        title: product.title,
        price: product.priceExcludingFees,
        total: totalPrice,
        image: product.photos[0] || '',
        quantity: 1,
        description: product.description,
        store: product.store,
      };
      this.cartItems.push(newCartItem);
    }
  
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartUpdated.next(this.getCartCount());
  
    return true;
  }
  
  
  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  
}
removeFromCart(product: CartItem) {
  const index = this.cartItems.findIndex(item => item.id === product.id);
  if (index > -1) {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartUpdated.next(this.getCartCount());
  }
}


  getItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.cartUpdated.next(0); // Pass 0 as the cart count since the cart is cleared
  }
}
