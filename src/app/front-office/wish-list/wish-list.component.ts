import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { CartService } from 'src/app/core/services/cart.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  userId: string;
  favoriteProducts: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastr: ToastrService,
    private cartService: CartService,
  private router:Router) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser._id) {
      this.userId = currentUser._id;
      this.getFavorites();
    }
  }
  browseProducts() {
    this.router.navigate(['/home']);
  }
  getFavorites(): void {
    this.wishlistService.getUserFavorites(this.userId).subscribe(
      data => {
        this.favoriteProducts = data.favorites;
      },
      error => {
        console.error('Error fetching favorites:', error);
      }
    );
  }

  removeFromFavorites(productId: string): void {
    this.wishlistService.removeFromFavorites(this.userId, productId).subscribe({
      next: (data) => {
        this.favoriteProducts = data.favorites;
        this.toastr.success('Removed from favorites');
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
        this.toastr.error('Failed to remove from favorites');
      }
    });
  }
  

  deleteAllFavorites(): void {
    this.wishlistService.deleteAllFavorites(this.userId).subscribe({
      next: (data) => {
        this.favoriteProducts = data.favorites;
        this.toastr.success('All favorites deleted');
      },
      error: (error) => {
        console.error('Error deleting all favorites:', error);
        this.toastr.error('Failed to delete all favorites');
      }
    });
  }
  

  addToCart(product: Product) {
    const success = this.cartService.addToCart(product);
    if (success) {
      this.toastr.success('Product added to cart', 'Success');
    } else {
      this.toastr.error(`You cannot add more than ${product.numberOfPieces} units of this product to your cart.`, 'Error');
    }
  }
  
}
