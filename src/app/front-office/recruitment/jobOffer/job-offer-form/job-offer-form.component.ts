import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobType, ContractType, TimeType, SalaryType } from 'src/app/core/models/job-offer';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { JobOfferService } from 'src/app/core/services/job-offer.service';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';
import { FileUploadService } from 'src/app/core/utils/sharedServices/upload.service';

@Component({
  selector: 'app-job-offer-form',
  templateUrl: './job-offer-form.component.html',
  styleUrls: ['./job-offer-form.component.css'],
})
export class JobOfferFormComponent implements OnInit {
  jobOfferForm: FormGroup;
  isSubmitted = false;
  loading = false;
  user: any;

  previewUrl: any = null;



  jobTypes = Object.values(JobType);
  contractTypes = Object.values(ContractType);
  timeTypes = Object.values(TimeType);
  salaryTypes = Object.values(SalaryType);

  constructor(
    private fb: FormBuilder,
    private router: Router,

    private jobOfferService: JobOfferService,
    private formValidationService: FormValidationService,
    private toastr: ToastrService, 
    private fileUploadService: FileUploadService,
    private authService:AuthService
  ) {
    
    
  }

  ngOnInit() {
    // Initialize user
    this.user = this.authService.currentUserValue;
  
    if (this.user && this.user.store) {
      this.initializeForm();
    } else {
      // Subscribe to auth status changes
      this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.user = this.authService.currentUserValue;
        if (this.user && this.user.store) {
          this.initializeForm();
        } else {
          console.error('User or user.store is undefined');
          // Handle error appropriately
        }
      });
    }
  }
  initializeForm() {
   
    this.jobOfferForm = this.fb.group({
      typeOfJob: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      contractType: ['', [Validators.required]],
      time: ['', [Validators.required]],
      image: ['', Validators.required],
      salaryMin: [null, [Validators.required, this.formValidationService.positiveNumberValidator()]],
      salaryMax: [null, [Validators.required, this.formValidationService.positiveNumberValidator()]],
      salaryType: ['', [Validators.required]],
      driversLicense: [false],
      address: ['', [Validators.required]],
      immediateHire: [false, [Validators.required]],
      store: [this.user.store],
    }, {
      validators: this.formValidationService.salaryRangeValidator('salaryMin', 'salaryMax'),
    });
    console.log("this is the store Id:",this.user.store);
  }

  get f() {
    return this.jobOfferForm.controls;
  }
  onFileSelected(event: any): void {
    const element = event.currentTarget as HTMLInputElement;
    const file: File | null = element.files ? element.files[0] : null;

    if (file) {
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.jobOfferForm.patchValue({ image: response.url });
        },
        error: (error) => {
          console.error('Upload error:', error);
        },
        complete: () => {
          console.log('Upload complete');
        }
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected or file is invalid.');
    }
  }
  onSubmit() {
    this.isSubmitted = true;

    if (this.jobOfferForm.invalid) {
      return;
    }

    this.loading = true;

    const jobOfferData = this.jobOfferForm.value;

    this.jobOfferService.createJobOffer(jobOfferData).subscribe({

      next:(response) => {
        console.log('Job Offer created successfully', response);
        this.toastr.success('Job Offer created successfully!', 'Success');

        // Reset the form
        this.jobOfferForm.reset();
        this.jobOfferForm.markAsPristine();
        this.jobOfferForm.markAsUntouched();
        this.isSubmitted = false;
        this.loading = false;
        this.router.navigate(['/job-offers-by-merchant']);

      },
      error:(error) => {
        console.error('Error creating job offer', error);
        this.toastr.error('An error occurred while creating the job offer. Please try again later.', 'Error');
        this.loading = false;
      }
    }  );
  }
}
