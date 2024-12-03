import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Discount, DiscountType } from 'src/app/core/models/discount';
import { Product } from 'src/app/core/models/product';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { DiscountService } from 'src/app/core/services/discount.service';
import { ProductService } from 'src/app/core/services/product.service';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';

@Component({
  selector: 'app-discount-create',
  templateUrl: './discount-create.component.html',
})
export class DiscountCreateComponent implements OnInit {
  discountForm: FormGroup;
  products: Product[] = [];
  userStoreId: string;
  currentUser: User;
  allSelected = false;
  selectedProductIds: string[] = [];


  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private formValidationService: FormValidationService 


  ) {
    this.discountForm = this.fb.group(
      {
        percentage: [
          null,
          [Validators.required, Validators.min(1), Validators.max(100)],
        ],
        startDate: ['', Validators.required],
        endDate: [
          '',
          [Validators.required, this.formValidationService.futureDateValidator()],
        ],
        products: [[]],
      },
      {
        validators: [
          this.formValidationService.startDateBeforeEndDateValidator(
            'startDate',
            'endDate'
          ),
        ],
      }
    );
  }

  
  ngOnInit() {
    this.authService.currentUser.subscribe({
      next:(user) => {
        if (user && user.store) {
          this.currentUser = user;
          this.userStoreId = user.store;
          this.loadStoreProducts();
      
        } else {
          console.error('User not logged in or does not have a store.');
          this.router.navigate(['/login']);
        }
      },
      error:(error) => {
        console.error('Error fetching user:', error);
        this.router.navigate(['/login']);
      }
  });
  }

  loadStoreProducts() {
    this.productService.getProductsByStoreId(this.userStoreId).subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Error fetching store products:', error);
      }
    );
  }
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;

    if (checked) {
      // Select all products
      this.selectedProductIds = this.products.map((product) => product._id);
    } else {
      // Deselect all products
      this.selectedProductIds = [];
    }
  }

  onProductCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const productId = checkbox.value;

    if (checkbox.checked) {
      this.selectedProductIds.push(productId);
    } else {
      const index = this.selectedProductIds.indexOf(productId);
      if (index > -1) {
        this.selectedProductIds.splice(index, 1);
      }
      // Uncheck "Select All" if any product is deselected
      this.allSelected = false;
    }

    // Check if all products are selected
    if (this.selectedProductIds.length === this.products.length) {
      this.allSelected = true;
    }
  }

  isProductSelected(productId: string): boolean {
    return this.selectedProductIds.includes(productId);
  }

  getSelectedProductsText(): string {
    if (this.selectedProductIds.length === 0) {
      return 'Sélectionner des produits';
    } else if (this.selectedProductIds.length === this.products.length) {
      return 'Tous les produits sont sélectionnés';
    } else {
      return `${this.selectedProductIds.length} produit(s) sélectionné(s)`;
    }
  }
  
  
  onSubmit() {
    if (this.discountForm.valid) {
      const formValue = this.discountForm.value;

      // Determine the discount type based on the number of products selected
      let discountType: DiscountType;

      if (this.selectedProductIds.length === 0) {
        discountType = DiscountType.Store;
      } else if (this.selectedProductIds.length === 1) {
        discountType = DiscountType.Product;
      } else if (this.selectedProductIds.length === this.products.length) {
        // All products selected, treat it as a store discount
        discountType = DiscountType.Store;
      } else {
        discountType = DiscountType.Products;
      }

      const discount: Discount = {
        percentage: formValue.percentage,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        products: this.selectedProductIds.length > 0 ? this.selectedProductIds : undefined,
        store: this.userStoreId,
        type: discountType,
      };

      this.discountService.createDiscount(discount).subscribe(
        (res) => {
          console.log('Discount created successfully:', res);
          this.router.navigate(['/discounts']);
        },
        (error) => {
          console.error('Error creating discount:', error);
        }
      );
    } else {
      this.discountForm.markAllAsTouched();
    }
  }
}