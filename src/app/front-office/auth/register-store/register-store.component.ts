import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogType } from 'src/app/core/models/blog';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { BlogService } from 'src/app/core/services/blog.service';

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: ['./register-store.component.css']
})
export class RegisterStoreComponent implements OnInit {
  storeForm: FormGroup;
  blogTypes = Object.values(BlogType);
  loading = false;
  submitted = false;
  user: User | null = null;
  storeId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the current user
    this.user = this.authService.currentUserValue;

    if (this.user && this.user.store) {
      this.storeId = this.user.store;
      this.initializeForm();
      this.loadStoreDetails(this.storeId);
    } else {
      this.toastr.error('No store associated with this user', 'Error');
      this.router.navigate(['/']); // Redirect to a suitable page
    }
  }

  initializeForm(): void {
    this.storeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      blogtype: ['', Validators.required],
      phoneNumber: [''], // Optional field
      description: ['']  // Optional field
    });
  }

  get f() { return this.storeForm.controls; }

  loadStoreDetails(storeId: string): void {
    this.blogService.getBlogById(storeId).subscribe({
      next: (data) => {
        this.storeForm.patchValue(data);
      },
      error: (error) => {
        this.toastr.error('Failed to load store details', 'Error');
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.storeForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.storeId) {
      this.blogService.updateBlog(this.storeId, this.storeForm.value).subscribe({
        next: (data) => {
          this.toastr.success('Store updated successfully', 'Success');
          this.router.navigate(['/profile']); // Navigate to the store list or another appropriate page
        },
        error: (error) => {
          this.toastr.error('Failed to update store', 'Error');
          console.error(error);
          this.loading = false;
        }
      });
    } else {
      this.toastr.error('Store ID is not defined', 'Error');
      this.loading = false;
    }
  }

  onCell1CountryChange(event: any): void {
    // Handle country change if needed
  }
}
