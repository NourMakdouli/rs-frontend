import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-two-fa-verification',
  templateUrl: './two-fa-verification.component.html',
  styleUrls: ['./two-fa-verification.component.css']
})
export class TwoFaVerificationComponent {
  code: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  verifyCode() {
    this.loading = true;
    this.authService.verifyTwoFactorCode(this.code).subscribe({
      next: () => {
        this.toastr.success('2FA verification successful', 'Success', {
          progressBar: true,
          closeButton: true,
        });
        // Navigate to the desired route after successful verification
        const returnUrl = '/'; // Adjust as needed
        this.router.navigate([returnUrl]);
        this.loading = false;
      },
      error: error => {
        console.error('2FA verification failed', error);
        this.toastr.error('Invalid 2FA code. Please try again.', 'Error', {
          progressBar: true,
          closeButton: true,
        });
        this.loading = false;
      }
    });
  }

}
