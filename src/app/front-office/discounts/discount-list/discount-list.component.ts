import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Discount, DiscountType } from 'src/app/core/models/discount';
import { Product } from 'src/app/core/models/product';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { DiscountService } from 'src/app/core/services/discount.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';
declare var bootstrap: any; 

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.css']
})

export class DiscountsListComponent implements OnInit {

  discounts: Discount[] = [];
  filterForm: FormGroup;
  editDiscountForm: FormGroup;
  userStoreId: string;

  currentUser: User;
  products: Product[] = [];
  modalProducts: Product[] = [];
  selectedDiscount: Discount | null = null;

  constructor(
    private discountService: DiscountService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
  ) 
  {
    this.filterForm = this.fb.group({
      type: [''],
      activeOnly: [false],
    });


    this.editDiscountForm = this.fb.group({
      percentage: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      endDate: ['', Validators.required],
    });
  }
  


  ngOnInit() {
    this.authService.currentUser.subscribe({
      next: (user) => {
        if (user && user.store) {
          this.currentUser = user;
          this.userStoreId = user.store;
          this.loadDiscounts();
        } else {
          console.error('User not logged in or does not have a store.');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.router.navigate(['/login']);
      }
    });
  }

























  openEditModal(discount: Discount) {
    this.selectedDiscount = discount;

  let formattedEndDate = '';
 
  if (discount.endDate instanceof Date) {
    formattedEndDate = discount.endDate.toISOString().split('T')[0];
  } else {
    // Handle unexpected types
    const endDate = new Date(discount.endDate);
    formattedEndDate = endDate.toISOString().split('T')[0];
  }
    this.editDiscountForm.patchValue({

      
      percentage: discount.percentage,
      endDate: formattedEndDate,
    });
  }

  onEditDiscountSubmit() {
    if (this.editDiscountForm.invalid || !this.selectedDiscount) {
      return;
    }

    const updatedValues = this.editDiscountForm.value;

    const updatedDiscount: Partial<Discount> = {
      percentage: updatedValues.percentage,
      endDate: updatedValues.endDate,
    };
if (this.selectedDiscount._id)
    this.discountService.updateDiscount(this.selectedDiscount._id, updatedDiscount).subscribe({
      next: (updatedDiscount) => {
        // Update the discount in the list
        const index = this.discounts.findIndex(
          (d) => d._id === this.selectedDiscount!._id
        );
        if (index !== -1) {
          this.discounts[index] = { ...this.discounts[index], ...updatedDiscount };
        }

     // Close the modal
     const modalElement = document.getElementById('editDiscountModal');
     if (modalElement) {
       const modal = bootstrap.Modal.getInstance(modalElement);
       if (modal) {
         modal.hide();
       } else {
         // If getInstance returns null, create a new instance and hide it
         const newModal = new bootstrap.Modal(modalElement);
         newModal.hide();
       }
     }

        // Reset the selected discount
        this.selectedDiscount = null;
      },
      error: (error) => {
        console.error('Error updating discount:', error);
        // Handle error, display message if necessary
      },
    });
  }














  loadDiscounts() {
    const filterValues = this.filterForm.value;
    const today = new Date();

    const filterParams: any = {};

    if (filterValues.type) {
      filterParams.type = filterValues.type;
    }

    if (filterValues.activeOnly) {
      filterParams.activeOnly = 'true'; 

    }

    this.discountService.getDiscountsByStoreWithFilters(this.userStoreId, filterParams).subscribe({
      next: (data) => {
        this.discounts = data;
        // Extract product IDs from discounts
        const productIds = this.discounts
          .filter((d) => Array.isArray(d.products) && d.products.length > 0)
          .flatMap((d) => d.products)
          .filter((id): id is string => typeof id === 'string' && id.trim().length > 0);
  
        const uniqueProductIds = [...new Set(productIds)];
  
        this.loadProductsByIds(uniqueProductIds);
      },
      error: (error) => console.error(error),
    });
  }

  loadProductsByIds(productIds: string[]) {
    if (!productIds.length) {
      this.products = [];
      return;
    }

    this.productService.getProductsByIds(productIds).subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  onFilterChange() {
    this.loadDiscounts();
  }

  getDiscountTypeLabel(type: DiscountType): string {
    switch (type) {
      case DiscountType.Product:
        return 'Remise sur produit';
      case DiscountType.Products:
        return 'Remise sur produits';
      case DiscountType.Store:
        return 'Remise sur magasin';
      default:
        return 'Remise';
    }
  }

  isDiscountActive(discount: Discount): boolean {
    const now = new Date();
    console.log("11",new Date(discount.startDate) <= now && new Date(discount.endDate) >= now)
    return new Date(discount.startDate) <= now && new Date(discount.endDate) >= now;
  }

  getProductsByIds(ids: string[]): Product[] {
    return this.products.filter((product) => ids.includes(product._id));
  }

  onEditDiscount(discount: Discount) {
    this.router.navigate(['/discounts/edit', discount._id]);
  }

  onDeleteDiscount(discount: Discount) {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette remise ?',
      text: 'Cette action ne peut pas être annulée',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez la remise'
    }).then((result) => {
      if (result.isConfirmed) {
        if (discount._id) {
          this.discountService.deleteDiscount(discount._id).subscribe({
            next: () => {
              this.discounts = this.discounts.filter((d) => d._id !== discount._id);
            },
            error: (error) => {
              console.error('Error deleting discount:', error);
            }
          });
        } else {
  
        }
          Swal.fire('Removed', 'Item has been removed from the cart.', 'success');
      }
    });
  }

  showProducts(discount: Discount) {
    if (discount.products && discount.products.length > 0) {
      this.modalProducts = this.getProductsByIds(discount.products);
    } else {
      // If the discount applies to all products
      this.modalProducts = [];
    }
  }
}