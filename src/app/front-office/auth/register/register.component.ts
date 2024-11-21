import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  referralCode: string | null = null;

  accountType: string;
  today: Date = new Date();
  loading = false;
  submitted = false;
  country = 'FR';  // Default country until detected from phone number

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private toastr: ToastrService,
    private validationService: FormValidationService  // Global validator service
  ) {}

  ngOnInit(): void {
    this.accountType = this.currentRoute.snapshot.params['accountType'];
    // Capture the referral code from query parameters
    this.currentRoute.queryParams.subscribe(params => {
      this.referralCode = params['referralCode'] || null;
    });

    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_]+$")]],  // Unique username
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      birthday: ['', [Validators.required, this.validationService.validateBirthday()]],  // Birthday must not be in the future
      phoneNumber: ['', [Validators.required]]  // Remove any custom pattern here, ngx-intl-tel-input will handle validation
    }, { 
      validator: this.validationService.passwordMatchValidator('password', 'confirmPassword')  // Custom validator for matching passwords
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }


  // Extract phone number in the required format
  const phoneNumber = this.registerForm.value.phoneNumber.e164Number;  // Choose the correct format as per your requirement

  // Prepare user data, excluding confirmPassword
  const { confirmPassword, phoneNumber: phone, ...newUser } = this.registerForm.value;

  // Update the newUser object with the correct phone number
  newUser.phoneNumber = phoneNumber;
  newUser.role = this.accountType;  // Assign account type to role
  newUser.countryOfResidence = "FR";  
    if (this.referralCode) {
      newUser.referralCode = this.referralCode;
    }
    this.authService.register(newUser).subscribe({
      next: (data) => {
        console.log('Registration successful',data);
        this.toastr.success('Registration successful!', 'Welcome');

        if (this.accountType === 'MERCHANT') {
          this.router.navigate(['/register-store']);

        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.toastr.error('Registration failed. Please try again.', 'Error');
        this.loading = false;
      }
    });
  }

  onCell1CountryChange(event: any): void {
    this.country = event.name;  // Capture the selected country name based on phone input
    console.log(`Phone country changed to: ${this.country}`);
  }
}
