import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { PayIn } from 'src/app/core/models/payIn';
import { PaymentService } from 'src/app/core/services/payment.service';

@Component({
  selector: 'app-payins-list',
  templateUrl: './payins-list.component.html',
  styleUrls: ['./payins-list.component.css']
})
export class PayinsListComponent implements OnInit {
  payIns: PayIn[] = [];
  isLoading = false;
  errorMessage = '';
  isAutomated: boolean = false;

  constructor(
    private adminPayoutService: PaymentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchPayIns();
    this.loadAutomationStatus();
  }

  loadAutomationStatus() {
    this.adminPayoutService.getPayoutAutomationStatus().subscribe({
      next:(status) => {
        this.isAutomated = status.isAutomated;
      },
      error:(error) => {
        console.error('Failed to load automation status:', error);
      }
   } );
  }

  async confirmToggleAutomationStatus() {
    const action = this.isAutomated ? 'disable' : 'enable';
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} automatic payouts?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      background: '#fefefe',
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
    });

    if (result.isConfirmed) {
      this.toggleAutomationStatus();
    } else {
      this.toastr.info('Automation setting was not changed.', 'Cancelled', {
        progressBar: true,
        closeButton: true,
      });
    }
  }

  toggleAutomationStatus() {
    this.adminPayoutService.updatePayoutAutomationStatus(!this.isAutomated).subscribe(
      () => {
        this.isAutomated = !this.isAutomated;
        this.toastr.success(
          `Payout automation ${this.isAutomated ? 'enabled' : 'disabled'}.`,
          'Success',
          { progressBar: true, closeButton: true }
        );
      },
      (error) => {
        console.error('Failed to update automation status:', error);
        this.toastr.error('Failed to update automation status', 'Error', {
          progressBar: true,
          closeButton: true,
        });
      }
    );
  }

  fetchPayIns() {
    this.isLoading = true;
    this.adminPayoutService.getPayInsToBePaidOut().subscribe({


      next:(data) => {
        this.payIns = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load PayIns';
        this.isLoading = false;
      }
    }
    );
  }

  initiatePayout(payInId: string) {
    if (this.isAutomated) {
      this.toastr.info('Payouts are automated. Manual initiation is disabled.', 'Info', {
        progressBar: true,
        closeButton: true,
      });
      return;
    }

    if (confirm('Are you sure you want to initiate payout for this PayIn?')) {
      this.adminPayoutService.initiatePayoutForPayIn(payInId).subscribe(
        () => {
          this.toastr.success('Payout initiated successfully', 'Success', {
            progressBar: true,
            closeButton: true,
          });
          this.fetchPayIns(); // Refresh the list
        },
        (error) => {
          this.toastr.error('Failed to initiate payout: ' + error.error.message, 'Error', {
            progressBar: true,
            closeButton: true,
          });
        }
      );
    }
  }
}
