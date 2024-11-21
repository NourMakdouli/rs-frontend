import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/core/models/product';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { CharacterLimitPipe } from 'src/app/core/utils/pipes/character-limit.pipe';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [CharacterLimitPipe] 

})
export class ProductsComponent implements OnInit, OnChanges {
  @Input() storeId?: string; 
  public productsList: Product[] = [];
  public visibleProducts: Product[] = [];
  public productsFound: number = 0;
  public numberOfProductsToShow = 8;
  cartCount: number;
 loggedIn:boolean=false;
 user:User | null;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toaster: ToastrService,
    private wishlistService: WishlistService,
    private authService:AuthService,
    private sanitizer: DomSanitizer, private characterLimitPipe: CharacterLimitPipe
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.user = this.authService.currentUserValue;
      this.loggedIn=this.authService.isAuthenticated
    } else {
    }


            if (!this.storeId) { 
            this.getAllProducts();
        }
    
    this.cartService.cartUpdated.subscribe((count: number) => {
      this.cartCount = count;
      
    });
     }

  showMoreProducts() {
    this.numberOfProductsToShow += 8;
    this.visibleProducts = this.productsList.slice(0, this.numberOfProductsToShow);
  }

  getAllProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Fetched products:', products); // Add this line

        this.productsList = this.filterProductsByStore(products);

           
           this.productsFound = this.productsList.length;
        this.visibleProducts = this.productsList.slice(0, this.numberOfProductsToShow);

        this.productsList.forEach(product => {
          this.productService.getEffectivePrice(product._id).subscribe({
            next: (response) => {
              product.isDiscounted = response.isDiscounted; 
              product.effectivePrice = response.effectivePrice;  
              product.discountId = response.discountId; 
            },
            error: (err) => {
              console.log(`Error fetching effective price for product ${product._id}:`, err);
            }
          });
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  filterProductsByStore(products: Product[]): Product[] {
    if (!this.storeId) {
      return products;
    }

    return products.filter(product => {
      if (product.store) {
        // If store is an object
        if (typeof product.store === 'object' && product.store._id) {
          return product.store._id === this.storeId;
        }
        // If store is a string (store ID)
        if (typeof product.store === 'string') {
          return product.store === this.storeId;
        }
      }
      return false;
    });
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
      this.user = this.authService.currentUserValue;
      this.loggedIn=this.authService.isAuthenticated;
      this.wishlistService.addToFavorites(this.user?._id, productId).subscribe(
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

  getLimitedDescription(description: string, limit: number): SafeHtml {
    const limitedDescription = this.characterLimitPipe.transform(description, limit);
    return this.sanitizer.bypassSecurityTrustHtml(limitedDescription);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['storeId'] && changes['storeId'].currentValue) {
      // Fetch products when storeId changes
      this.getAllProducts();
    }
  }

}
