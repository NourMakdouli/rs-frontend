import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-two-factor-settings',
  templateUrl: './two-factor-settings.component.html',
  styleUrls: ['./two-factor-settings.component.css'],
})
export class TwoFactorSettingsComponent implements OnInit {
  qrCodeDataURL: string | null = null;
  code: string = '';
  isTwoFactorEnabled: boolean = false;
  loading: boolean = false;
  disableCode: string = '';


  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    this.isTwoFactorEnabled = currentUser?.isTwoFactorEnabled || false;
  }

  generateQrCode() {
    this.loading = true;
    this.authService.generateTwoFactorSecret().subscribe({
      next: (response) => {
        this.qrCodeDataURL = response.qrCodeDataURL;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to generate QR code', error);
        this.toastr.error('Failed to generate QR code', 'Error', {
          progressBar: true,
          closeButton: true,
        });
        this.loading = false;
      },
    });
  }

  async disableTwoFactor() {
    // Validate the disable code input
    if (this.disableCode.length !== 6 || isNaN(+this.disableCode)) {
      this.toastr.error('Please enter a valid 6-digit code.', 'Error', {
        progressBar: true,
        closeButton: true,
      });
      return;
    }

    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to disable Two-Factor Authentication?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it',
      cancelButtonText: 'No, keep it enabled',
    });

    if (result.isConfirmed) {
      this.loading = true;
      this.authService.disableTwoFactorAuthentication(this.disableCode).subscribe({
        next: () => {
          this.toastr.success('Two-Factor Authentication has been disabled.', 'Success', {
            progressBar: true,
            closeButton: true,
          });
          this.isTwoFactorEnabled = false;
          this.disableCode = '';
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to disable 2FA', error);
          this.toastr.error('Invalid 2FA code. Please try again.', 'Error', {
            progressBar: true,
            closeButton: true,
          });
          this.loading = false;
        },
      });
    } else {
      // User canceled the action
      this.toastr.info('Two-Factor Authentication remains enabled.', 'Cancelled', {
        progressBar: true,
        closeButton: true,
      });
    }
  }
  

  enableTwoFactor() {
    this.loading = true;
    this.authService.enableTwoFactorAuthentication(this.code).subscribe({
      next: () => {
        this.toastr.success('2FA enabled successfully', 'Success', {
          progressBar: true,
          closeButton: true,
        });
        this.isTwoFactorEnabled = true;
        this.qrCodeDataURL = null;
        this.code = '';
        this.loading = false;
      },
      error: (error) => {
        console.error('Invalid 2FA code', error);
        this.toastr.error('Invalid 2FA code', 'Error', {
          progressBar: true,
          closeButton: true,
        });
        this.loading = false;
      },
    });
  }
}