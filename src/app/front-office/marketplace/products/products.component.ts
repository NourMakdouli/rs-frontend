import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { Product } from 'src/app/core/models/product';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { CharacterLimitPipe } from 'src/app/core/utils/pipes/character-limit.pipe';
import { filterProductsBySearch, filterProductsByStore, sortProducts } from 'src/app/core/utils/product-utils'; // Your utility functions
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [CharacterLimitPipe]
})
export class ProductsComponent implements OnInit, OnChanges,OnDestroy {
  @Input() storeId?: string; 
  public originalProductsList: Product[] = [];    
  public productsList: Product[] = [];            
  public visibleProducts: Product[] = [];         
  public searchTerm: string = '';

  public productsFound: number = 0;
  public numberOfProductsToShow = 8;

  cartCount: number;
  loggedIn: boolean = false;
  user: User | null;
  
  currentSort: string = '0'; // or '0' if you prefer numeric mapping
  private searchSubject: Subject<string> = new Subject<string>();
  private searchSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toaster: ToastrService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private sanitizer: DomSanitizer, 
    private characterLimitPipe: CharacterLimitPipe
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.user = this.authService.currentUserValue;
      this.loggedIn = this.authService.isAuthenticated;
    }

    if (!this.storeId) { 
      this.fetchAllProducts();
    }

    this.cartService.cartUpdated.subscribe((count: number) => {
      this.cartCount = count;
    });
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),          // Wait 300ms after the last event before emitting last event
      distinctUntilChanged()      // Only emit if value is different from previous
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.applyFiltersAndSort();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['storeId'] && changes['storeId'].currentValue) {
      // Refetch or re-apply filters when storeId changes
      this.fetchAllProducts();
    }
  }

  fetchAllProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.originalProductsList = products;
        this.productsFound = products.length;

        // Fetch discount data for each product
        this.originalProductsList.forEach(product => {
          this.productService.getEffectivePrice(product._id).subscribe({
            next: (response) => {
              product.isDiscounted = response.isDiscounted; 
              product.effectivePrice = response.effectivePrice;  
              product.discountId = response.discountId; 
              this.applyFiltersAndSort(); // After updates, re-apply filters/sort
            },
            error: (err) => {
              console.log(`Error fetching effective price for product ${product._id}:`, err);
            }
          });
        });

        // Initially apply filters/sort after fetching
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private applyFiltersAndSort(): void {
    let result = filterProductsByStore(this.originalProductsList, this.storeId);
    result = sortProducts(result, this.mapSortOption(this.currentSort));
    result = filterProductsBySearch(result, this.searchTerm);

    this.productsList = result;
    this.productsFound = result.length;
    this.updateVisibleProducts();
  }
  ngOnDestroy(): void {
    // Prevent memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  private mapSortOption(option: string): string {
    switch (option) {
      case '0': return 'Relevance';
      case '1': return 'NameAsc';
      case '2': return 'NameDesc';
      case '3': return 'PriceAsc';
      case '4': return 'PriceDesc';
      case '5': return 'InStock';
      case '6': return 'Random';
      default: return 'Relevance';
    }
  }

  updateVisibleProducts() {
    this.visibleProducts = this.productsList.slice(0, this.numberOfProductsToShow);
  }

  showMoreProducts() {
    this.numberOfProductsToShow += 8;
    this.updateVisibleProducts();
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.currentSort = value;
    this.applyFiltersAndSort();
  }
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value);
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
      this.loggedIn = this.authService.isAuthenticated;
      this.wishlistService.addToFavorites(this.user?._id, productId).subscribe({
        next:(data) => {
          this.authService.setCurrentUser(data);
          this.toaster.success('Added to favorites!', 'Success');
        },
        error:(error) => {
          console.error('Error adding to favorites:', error);
          this.toaster.error('Failed to add to favorites.', 'Error');
        }
    });
    } else {
      this.toaster.info('Please log in to add to favorites.', 'Info');
    }
  }

  getLimitedDescription(description: string, limit: number): SafeHtml {
    const limitedDescription = this.characterLimitPipe.transform(description, limit);
    return this.sanitizer.bypassSecurityTrustHtml(limitedDescription);
  }
}
