import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobOfferData } from 'src/app/core/models/job-offer';
import { JobApplicationService } from 'src/app/core/services/job-application.service';
import { JobOfferService } from 'src/app/core/services/job-offer.service';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';
import { FileUploadService } from 'src/app/core/utils/sharedServices/upload.service';

@Component({
  selector: 'app-job-offer-details',
  templateUrl: './job-offer-details.component.html',
  styleUrls: ['./job-offer-details.component.css']
})
export class JobOfferDetailsComponent implements OnInit {
  public jobOffer: JobOfferData;
  applicationForm: FormGroup;
  isSubmitted = false;
  selectedFile: File | null = null;
  uploadInProgress = false;
  uploadError: string | null = null;
  resumeFilename: string | null = null;
  applicationError: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private jobOfferService: JobOfferService,
    private jobApplicationService: JobApplicationService,
    private uploadService: FileUploadService,
    private formValidationService: FormValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getJobOffer();

    // Initialize the application form
    this.applicationForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, this.formValidationService.emailFormat()]],
      phoneNumber: ['', [Validators.required]],
      city: [''],
      postalCode: [''],
      description: [''],
      typeOfJob: [''], // Enabled control
      applicationType: ['Specific'], // Changed to 'Specific'
      isLinkedToJobOffer: [true],
      jobOffer: [''], // Will set this to jobOffer ID
    });
  }

  getJobOffer() {
    const id = this.route.snapshot.params['id'];
    this.jobOfferService.getJobOfferById(id).subscribe({
      next: (jobOfferdata: JobOfferData) => {
        this.jobOffer = jobOfferdata;

        // Set the job offer ID and typeOfJob in the form
        this.applicationForm.patchValue({
          jobOffer: this.jobOffer._id,
          typeOfJob: this.jobOffer.typeOfJob,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get f() {
    return this.applicationForm.controls;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.applicationForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.selectedFile) {
      this.uploadInProgress = true;
      this.uploadService.uploadResume(this.selectedFile).subscribe(
        (response) => {
          this.uploadInProgress = false;
          this.resumeFilename = response.url; // Adjust according to your backend response
          this.submitApplication();
        },
        (error) => {
          this.uploadInProgress = false;
          this.uploadError = 'File upload failed';
          console.error(error);
          this.loading = false;
        }
      );
    } else {
      this.submitApplication();
    }
  }

  submitApplication() {
    const applicationData = this.applicationForm.value;

    if (this.resumeFilename) {
      applicationData.resume = this.resumeFilename;
    }

    // Set additional fields if needed
    applicationData.jobOffer = this.jobOffer._id;
    applicationData.isLinkedToJobOffer = true;
    applicationData.applicationType = 'Specific'; // Changed to 'Specific'

    this.jobApplicationService.createJobApplication(applicationData).subscribe(
      (response) => {
        console.log('Application submitted successfully', response);
        this.toastr.success('Application submitted successfully!', 'Success');

        // Reset the form
        this.applicationForm.reset();
        this.applicationForm.markAsPristine();
        this.applicationForm.markAsUntouched();
        this.isSubmitted = false;
        this.selectedFile = null;
        this.resumeFilename = null;
        this.loading = false;
      },
      (error) => {
        console.error('Error submitting application', error);
        this.toastr.error('An error occurred while submitting your application. Please try again later.', 'Error');
        this.loading = false;
      }
    );
  }
}
