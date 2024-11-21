import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  user: any;
  loggedIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,    private route: ActivatedRoute,

    private router: Router, private toastr: ToastrService 
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.loggedIn = isAuthenticated;
      this.user = this.authService.currentUserValue;
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
  
    if (this.loginForm.invalid) {
      console.log("Login form is invalid");
      return;
    }
  
    this.loading = true;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('Return URL:', returnUrl);
  
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: response => {
          console.log('Login response:', response);
  
          if (response.isTwoFactorEnabled) {
            localStorage.setItem('twoFactorUserId', response.userId);
            this.router.navigate(['/2fa-verification']);
          } else if (response && response.user) {
            //login success without 2fa
            console.log('Login successful', response);
            this.toastr.success('Login success', 'Welcome Back!', {
              progressBar: true,
              closeButton: true,
            });
            this.router.navigate([returnUrl]);
          }
          this.loading = false;
        },
        error: error => {
          // Errors are already handled in AuthService
          console.error('Login failed', error);
          this.loading = false;
        }
      });
  }
  
  
}
