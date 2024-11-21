import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { FileUploadService } from 'src/app/core/utils/sharedServices/upload.service';
import { Blog, BlogType } from 'src/app/core/models/blog';
import { BlogService } from 'src/app/core/services/blog.service';
import { User } from 'src/app/core/models/user';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  profileForm: FormGroup;
  storeForm: FormGroup;
  submitted = false;
  changePasswordForm: FormGroup; // Add this line

  user: User | null = null;
  store: Blog | null = null;

  loading = false;
  blogTypes = Object.values(BlogType);
  selectedFile: File | null = null;
  timestamp: number = new Date().getTime();
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
    private formValidationService: FormValidationService,
    private fileUploadService: FileUploadService,
    private blogService: BlogService
  ) {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      nationality: [''],
      countryOfResidence: [''],
      addressdelievery: [''],
      cityldelivery: [''],
      zipdelivery: [''],
      phonedelivery: [''],
      mobileldelivery: ['']
    });
    

    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      image: [''],
      city: [''],
      zipCode: [''],
      blogtype: [null, Validators.required],
      phoneNumber: [''],
      description: [''],
      siretNumber: ['']
    });
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [this.formValidationService.requiredField()]],
        newPassword: [
          '',
          [
            this.formValidationService.requiredField(),
            this.formValidationService.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'),
          ],
        ],
        confirmNewPassword: ['', [this.formValidationService.requiredField()]],
      },
      {
        validator: this.formValidationService.passwordMatchValidator('newPassword', 'confirmNewPassword'),
      }
    );
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.user = this.authService.currentUserValue;
    if (this.user) {
      this.profileForm.patchValue(this.user);

      if (this.user.role === 'MERCHANT' && this.user.store) {
        this.fetchStoreDetails(this.user.store);
      }
    }
  }

  private fetchStoreDetails(storeId: string): void {
    this.blogService.getBlogById(storeId).subscribe({
      next: (store) => {
        this.store = store;
        this.storeForm.patchValue(store);
      },
      error: (error) => {
        console.error('Failed to fetch store details', error);
        this.toastr.error('Failed to load store details', 'Error');
      }
    });
  }

  updateStore(): void {
    if (this.storeForm.invalid) {
      this.toastr.error('Please check the store form for errors', 'Form Error');
      return;
    }
    if (!this.store || !this.store._id) {
      this.toastr.error('Invalid store data', 'Error');
      return; // Add return to prevent further execution if store or store ID is undefined
    }
    this.loading = true;
  
    // Now this.store._id is guaranteed to be non-undefined
    this.blogService.updateBlog(this.store._id, this.storeForm.value).subscribe({
      next: (updatedStore) => {
        this.toastr.success('Store updated successfully', 'Success');
        this.store = updatedStore;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating store:', error);
        this.toastr.error('Failed to update store', 'Error');
        this.loading = false;
      }
    });
  }
  

  onSubmit(): void {
    if (this.profileForm.invalid || !this.user?._id) {
      this.toastr.error('Please check the profile form for errors', 'Form Error');
      return;
    }

    this.loading = true;
    const updatedUserData = { ...this.profileForm.value };
    this.userService.updateUser(this.user._id, updatedUserData).subscribe({
      next: (updatedUser) => {
        this.toastr.success('Profile updated successfully', 'Success');
        this.authService.setCurrentUser(updatedUser);
        this.user = updatedUser;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
        this.toastr.error('Failed to update profile', 'Error');
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  uploadImage(): void {
    if (!this.selectedFile || !this.user?._id) {
      return;
    }

    this.loading = true;
    const userId = this.user._id;

    // Upload the file
    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        const imagePath = response.filePath || response.url; // Adjust based on your API's response

        // Update the user's profile with the new image path
        this.userService.updateUser(userId, { image: imagePath }).subscribe({
          next: (updatedUser) => {
            this.toastr.success('Profile image updated successfully', 'Success');
            // Update the current user in AuthService and local user variable
            this.authService.setCurrentUser(updatedUser);
            this.user = updatedUser;
            this.selectedFile = null;
            this.loading = false;
            this.imagePreview = null;
            this.timestamp = new Date().getTime(); // Update timestamp to refresh image
          },
          error: (error) => {
            console.error('Failed to update user', error);
            this.toastr.error('Failed to update profile image', 'Error');
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Failed to upload file', error);
        this.toastr.error('Failed to upload image', 'Error');
        this.loading = false;
      }
    });
  }


  onChangePasswordSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.toastr.error('Please correct the errors in the form', 'Form Error');
      return;
    }

    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: (response) => {
        const { oldPasswordMatch, userUpdated } = response;

        if (!oldPasswordMatch) {
          this.toastr.error('Current password is incorrect', 'Error');
        } else if (userUpdated) {
          this.toastr.success('Password changed successfully', 'Success');
          this.changePasswordForm.reset();
        } else {
          this.toastr.error('Failed to update password', 'Error');
        }
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.toastr.error('An error occurred while changing password', 'Error');
      },
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}
