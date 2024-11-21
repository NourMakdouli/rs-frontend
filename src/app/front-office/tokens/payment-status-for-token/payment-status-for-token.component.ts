// payment-status-for-token.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/core/services/payment.service';

@Component({
  selector: 'app-payment-status-for-token',
  templateUrl: './payment-status-for-token.component.html',
})
export class PaymentStatusForTokenComponent implements OnInit {
  payInId: string;
  timeout: number = 120; // 2 minutes
  startTime: number;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.payInId = localStorage.getItem('payInIdToken') || '';
    this.startTime = Date.now();

    if (this.payInId) {
      this.checkPaymentStatus();
    } else {
      console.log('No payInId found.');
      this.toastr.error('Payment information is missing, please try again.', 'Error');
      this.router.navigate(['/buy-tokens']);
    }
  }

  checkPaymentStatus(): void {
    this.paymentService.checkPayInStatus(this.payInId).subscribe({
      next: (statusResponse: any) => {
        if (statusResponse.status === 'FAILED') {
          console.log('Payment failed', statusResponse);
          this.toastr.error('Payment failed.', 'Error');
          this.router.navigate(['/buy-tokens']);
        } else if (statusResponse.status === 'SUCCEEDED') {
          this.handleSuccess();
        } else {
          this.handleInProgress();
        }
      },
      error: (err: any) => {
        console.error('Error checking payment status:', err);
        this.toastr.error('Unable to check payment status. Please try again later.', 'Error');
      }
    });
  }

  handleSuccess(): void {
    localStorage.removeItem('payInIdToken');

    this.toastr.success('Tokens purchased successfully.', 'Success');
    this.router.navigate(['/user-profile']); // Adjust the route as needed
  }

  handleInProgress(): void {
    const elapsedTime = (Date.now() - this.startTime) / 1000;

    if (elapsedTime > this.timeout) {
      console.error('Timeout reached. Exiting loop.');
      this.toastr.error('Payment processing timed out. Please check your account or contact support.', 'Error');
      this.router.navigate(['/buy-tokens']);
    } else {
      setTimeout(() => this.checkPaymentStatus(), 15000); 
    }
  }
}
