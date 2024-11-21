import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/core/models/order';
import { AuthService } from 'src/app/core/services/auth.service';
import { OrderService } from 'src/app/core/services/order.service';
import { SortingService } from 'src/app/core/utils/sharedServices/sorting.service';

@Component({
  selector: 'app-order-by-individual',
  templateUrl: './order-by-individual.component.html',
  styleUrls: ['./order-by-individual.component.css']
})
export class OrderByIndividualComponent implements OnInit {
  orderList: Order[] = [];
  selectedOrder: Order | null = null;
  showAlert: boolean = false; 

  constructor(
    private ordersService: OrderService,
    private authService: AuthService,
    private sortingService: SortingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.selectedOrder = navigation.extras.state['selectedOrder'];
      console.log('selected orderin order by individual',this.selectedOrder);
      this.showAlert = !!this.selectedOrder; 
    }

    if (this.authService.isAuthenticated) {
      const accountId = this.authService.currentUserValue?._id;
      if (accountId) {
        this.ordersService.getOrdersByUser(accountId).subscribe((orders) => {
          this.orderList = orders;
          console.log(this.orderList);

          if (this.selectedOrder) {
            console.log('Selected order:', this.selectedOrder);
          }
        });
      }
    }
  }

  closeAlert(): void {
    this.showAlert = false;
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

  sortData(field: string): void {
    const allowedFields = ['createdAt', 'totalPrice', 'status', 'location'];
    this.orderList = this.sortingService.sortData(field, this.orderList, allowedFields);
  }
}
