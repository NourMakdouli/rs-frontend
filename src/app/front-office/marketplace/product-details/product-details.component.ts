import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/core/models/product';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  public product: Product;
  
 // isDiscountApplied: boolean = false;
  effectivePrice: number;

  public selectedImageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private wishlistService:WishlistService,
    private router:Router

  ) {}

  ngOnInit(): void {
    this.getProduct();
   
  }
  

  getProduct() {
    const id = this.route.snapshot.params['id'];
    console.log(id);
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        console.log(this.product);
       
    
        this.productService.getEffectivePrice(this.product._id).subscribe(response => {
          this.effectivePrice = response.effectivePrice;

        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  selectImage(index: number) {
    this.selectedImageIndex = index;
  }


  getActiveClass(index: number): string {
    return index === this.selectedImageIndex ? 'active' : '';
  }

  buyNow(){
this.addToCart(this.product);
this.router.navigate(['/marketplace/cart']);

  }
  addToCart(product: Product) {
    const priceToAdd = product.isDiscounted ? product.effectivePrice : product.priceExcludingFees;

    // Create a copy of the product with the adjusted price
    const productToAdd = { ...product, price: priceToAdd };
  
    const success = this.cartService.addToCart(productToAdd);
    if (success) {
      this.toastr.success('Product added to cart', 'Success');
    } else {
      this.toastr.error(`You cannot add more than ${product.numberOfPieces} units of this product to your cart.`, 'Error');
    }
  }
  
  addToWishlist(product:Product){



  }
  
}
