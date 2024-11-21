import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { SortingService } from 'src/app/core/utils/sharedServices/sorting.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy, AfterViewInit {
  products: Product[] = [];
  dataTable: DataTable | undefined;
  currentUser:User | null=null;
  productSubscription: Subscription | undefined;
  sortOrder: { [key: string]: 'asc' | 'desc' } = {};
  searchText: any;

  constructor(private productService: ProductService, private readonly authService:AuthService,    private sortingService: SortingService 
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  
    if (this.currentUser?.store) {
      // Only call getProductsByStoreId if the store is defined
      this.productSubscription = this.productService.getProductsByStoreId(this.currentUser.store).subscribe((products) => {
        this.products = products;
        console.log(products);
        this.initDataTable();
      });
    } else {
      // Handle the case where store is undefined, e.g., show a message or handle the error
      console.error('Store is undefined for the current user');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No store associated with the current user!',
      });
    }
  }
  
  ngAfterViewInit(): void {
    this.initDataTable();
  }



 



  sortData(field: string): void {
    const allowedFields = ['createdAt', 'title', 'type', 'address','priceExcludingFees'];
    this.products = this.sortingService.sortData(field, this.products, allowedFields);
  }
  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  private initDataTable(): void {
    const tableElement = document.querySelector('#productTable') as HTMLTableElement;
    if (tableElement) {
      this.dataTable = new DataTable(tableElement, {
        searchable: true,
        fixedHeight: true,
        perPageSelect: [5, 10, 15, -1],
      });
    }
  }

  deleteProduct(id: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this article?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.products = this.products.filter(product => product._id !== id);
          this.dataTable?.destroy();
          this.initDataTable();
        });
      }
    });
  }

  
}
