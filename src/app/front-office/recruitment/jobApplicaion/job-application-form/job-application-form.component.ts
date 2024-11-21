import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { JobType } from 'src/app/core/models/job-offer';
import { JobApplicationService } from 'src/app/core/services/job-application.service';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';
import { FileUploadService } from 'src/app/core/utils/sharedServices/upload.service';

@Component({
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.css']
})
export class JobApplicationFormComponent implements OnInit {
  applicationForm: FormGroup;
  isSubmitted = false;
  loading=false;
  selectedFile: File | null = null;
  uploadInProgress = false;
  
  uploadError: string | null = null;
  resumeFilename: string | null = null;
  applicationError: string | null = null;

  jobTypes = Object.values(JobType);

  constructor(
    private fb: FormBuilder,
    private jobApplicationService: JobApplicationService,
    private uploadService: FileUploadService,
    private formValidationService: FormValidationService,
    private toastr:ToastrService,

  ) {
    this.applicationForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, this.formValidationService.emailFormat()]],
      phoneNumber: ['', [Validators.required]],
      city: [''],
      postalCode: [''],
      description: [''],
      typeOfJob: ['', [Validators.required]],
      applicationType: ['Spontaneous'],      // Added with default value
      isLinkedToJobOffer: [false],           // Added with default value
      jobOffer: [''], // Initialized with an empty string
    });
  }

  ngOnInit() {
    // No additional initialization needed
  }

  get f() {
    return this.applicationForm.controls;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      this.selectedFile = file;

      this.uploadError = null;  
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.applicationForm.invalid) {
     this.toastr.error('Please fill in all required fields correctly.', 'Form Invalid');  

      return;
    }
    this.loading = true;
    if (this.selectedFile) {
      this.uploadInProgress = true;
      this.uploadService.uploadResume(this.selectedFile).subscribe({
        next: (response) => {  
          this.uploadInProgress = false;
          this.resumeFilename = response.url;
          this.submitApplication();
        },
        error: (error) => {  
          this.uploadInProgress = false;
          this.uploadError = 'File upload failed';
          console.error(error);
          this.loading = false;
        },
        complete: () => {  
          console.log('Upload completed');
        }
      });
    }
     else {
      this.submitApplication();
    }
  }

  submitApplication() {
    const applicationData = this.applicationForm.value;
    applicationData.applicationType = 'Spontaneous'; 
    applicationData.isLinkedToJobOffer = false; 

    if (this.resumeFilename) {
      applicationData.resume = this.resumeFilename;
    }
    if (applicationData.jobOffer === '') {
      applicationData.jobOffer = null;
    }
    this.jobApplicationService.createJobApplication(applicationData).subscribe(
      (response) => {
        console.log('Application submitted successfully', response);
        // Reset the form
        this.applicationForm.reset();
        this.applicationForm.markAsPristine();
        this.applicationForm.markAsUntouched();
        this.isSubmitted = false;
        this.selectedFile = null;
        this.resumeFilename = null;
        this.loading = false;
        this.toastr.success('Application submitted successfully!', 'Success');


      },
      (error) => {
        console.error('Error submitting application', error);
        this.applicationError = 'An error occurred while submitting your application. Please try again later.';
        this.toastr.error('An error occurred while submitting your application. Please try again later.', 'Error');
        this.loading = false;
  
      }
    );
  }
}
