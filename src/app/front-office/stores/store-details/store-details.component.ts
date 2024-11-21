import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'src/app/core/models/blog';
import { Product } from 'src/app/core/models/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { BlogService } from 'src/app/core/services/blog.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.css']
})
export class StoreDetailsComponent  implements OnInit {

  
  blogId!: string;
  blog!: Blog;
  userId!: string;  
  isAuthenticated:boolean=false;
  productList:Product[]=[];


  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService:AuthService, 
    private productService:ProductService,
    private cartService: CartService,
    private toaster: ToastrService,
    private wishlistService: WishlistService,

  ) {}

  ngOnInit(): void {
    this.isAuthenticated=this.authService.isAuthenticated;
    this.userId=this.authService.currentUserValue?._id || "";
    this.blogId = this.route.snapshot.paramMap.get('id')!;
    console.log('blogId:', this.blogId); // Add this line to confirm blogId
    this.fetchBlog();
    this.fetchBlogProducts();


  }

  fetchBlog(): void {
    this.blogService.getBlogById(this.blogId).subscribe((data) => {
      this.blog = data;
      console.log(this.blog)
    });
  }
  fetchBlogProducts(){
    this.productService.getProductsByStoreId(this.blogId).subscribe((data) => {
      this.productList=data;
      console.log(this.productList);
    })
  }


  onReviewSubmitted(): void {
    this.fetchBlog();
    this.fetchBlogProducts();
    
  }
  getStarsArray(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = (rating % 1) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('full'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  }
  addToCart(product: Product) {
    const success = this.cartService.addToCart(product);
    if (success) {
      this.toaster.success('Product added to cart', 'Success');
    } else {
      this.toaster.error(`You cannot add more than ${product.numberOfPieces} units of this product to your cart.`, 'Error');
    }
  }
  


  

  addToFavorites(productId: string): void {
    if (this.authService.currentUserValue) {
      this.wishlistService.addToFavorites(this.userId, productId).subscribe(
        data => {
          console.log(data.favorites);
          this.authService.setCurrentUser(data);
  
  
        },
        error => {
          console.error('Error adding to favorites:', error);
        }
      );
    } else {
    }
    
  }
}