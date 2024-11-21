import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderStatus, UpdateOrderStatusDto } from 'src/app/core/models/order';
import { CartService } from 'src/app/core/services/cart.service';
import { OrderService } from 'src/app/core/services/order.service';
import { PaymentService } from 'src/app/core/services/payment.service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
})
export class PaymentStatusComponent implements OnInit {
  payInId: string ;
  orderId:string;
  timeout: number = 120; // d9i9tin
  startTime: number;
 ;

  constructor(private paymentService: PaymentService, private router: Router,    private toastr: ToastrService,private  cartService: CartService, private orderService: OrderService // Added Toastr for notifications
  ) {}

  ngOnInit(): void {
    this.payInId = localStorage.getItem('payInId') || '';
    this.orderId = localStorage.getItem('orderId') || '';

    this.startTime = Date.now();

    if (this.payInId) {
      this.checkPaymentStatus();
    } else {
      console.log('No payInId found.');
      this.toastr.error('Payment information is missing please re-try again.', 'Error');      
      this.router.navigate(['/marketplace/checkout',this.orderId]); // Redirect if no payInId is found
    }
  }

  checkPaymentStatus(): void {
    this.paymentService.checkPayInStatus(this.payInId).subscribe({
      next: (statusResponse: any) => {
        if (statusResponse.status === 'FAILED') {
          console.log('checkPaymentStatus method and Payment failed',statusResponse);
        } else if (statusResponse.status === 'SUCCEEDED') {
          this.handleSuccess();
        } else {
          this.handleInProgress();
        }
      },
      error: (err: any) => {
        console.error('Error checking payment status:', err);
        this.toastr.error('Unable to check payment status. Please try again later.', 'Error');

       // this.router.navigate(['/payment-failure']);
      }
    });
  }

  handleSuccess(): void {
    localStorage.removeItem('payInId');
    localStorage.removeItem('orderId');

    this.cartService.clearCart();
    this.orderService.confirmOrder(this.orderId).subscribe({
      next: (updatedOrder) => {
        console.log('Order confirmed:', updatedOrder);
        this.toastr.success('Payment succeeded and order confirmed.', 'Success');
 
        this.router.navigate(['/orders-by-individual'], { 
          state: { 
            selectedOrder: updatedOrder 
          } 
        });     },
      error: (err) => {
        console.error('Error confirming order:', err);
        this.toastr.error('There was a problem confirming your order. Please contact support.', 'Error');
      }
    });
  }

  handleInProgress(): void {
    const elapsedTime = (Date.now() - this.startTime) / 1000;

    if (elapsedTime > this.timeout) {
      console.error('Timeout reached. Exiting loop.');
    } else {
      setTimeout(() => this.checkPaymentStatus(), 15000); 
    }
  }


}
