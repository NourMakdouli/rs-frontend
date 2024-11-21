import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/core/models/order';
import { SortingService } from 'src/app/core/utils/sharedServices/sorting.service';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-order-by-merchant',
  templateUrl: './order-by-merchant.component.html',
  styleUrls: ['./order-by-merchant.component.css']
})
export class OrderByMerchantComponent implements OnInit {
  searchText: string;
  orderByMerchant: Order[] = [];
  selectedOrder: Order | null = null;

  constructor(
    private ordersService: OrderService,
    private authService: AuthService,
    private sortingService: SortingService
  ) {}

  ngOnInit(): void {
      if (this.authService.isAuthenticated) {
        const merchant = this.authService.currentUserValue;
        if (merchant && merchant.store) {
          this.ordersService.getOrdersByStore(merchant.store).subscribe((orders) => {
            this.orderByMerchant = orders;
            console.log(this.orderByMerchant);
          });
        } else {
          console.error('Merchant or store is undefined');
        }
      }
    }
    

  sortData(field: string): void {
    const allowedFields = ['createdAt', 'totalPrice', 'status', 'location'];
    this.orderByMerchant = this.sortingService.sortData(field, this.orderByMerchant, allowedFields);
  }

  getBadgeClasses(status: string): string[] {
    const classes = ['badge'];
    switch (status) {
      case 'pending':
        classes.push('bg-warning', 'text-light');
        break;
      case 'confirmed':
        classes.push('bg-success', 'text-light');
        break;
      case 'cancelled':
        classes.push('bg-danger');
        break;
      case 'delivered':
        classes.push('bg-info', 'text-light');
        break;
    }
    return classes;
  }
  
}
