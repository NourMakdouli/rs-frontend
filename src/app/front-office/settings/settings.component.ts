import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/core/models/blog';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { BlogService } from 'src/app/core/services/blog.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentBlog: Blog;
  currentUser: User;
  documentId = '';
  status = 'VALIDATION_ASKED';
  selectedFile: File | null = null;
  base64File: string | null = null;
  bankAccountDetails = {
    iban: '',
    bic: '',
  };
  showBankForm = false;
  isLoading = false;
  isSellingEnabled = false;
  isTwoFactorEnabled = false;


  constructor(
    private paymentService: PaymentService,
    private blogService: BlogService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    // Fetch the current user and blog details
    const user = this.authService.currentUserValue;
    if (user) {

      this.currentUser = user; 
      this.isTwoFactorEnabled = this.currentUser.isTwoFactorEnabled || false;
      this.blogService.getBlogByOwner(this.currentUser._id).subscribe({
        next: (blog) => {
          this.currentBlog = blog;
          this.isSellingEnabled = !!this.currentBlog.bankMangoPayId;

        },
        error: (error) => {
          console.error('Error fetching blog:', error);
        }
      });
    } else {
      console.error('No current user found');
      // Handle the case when there is no current user, for example, by redirecting or showing an error message.
    }

  }
  


  enableSelling() {
    this.isLoading = true;
    if (this.currentUser) {
      this.ensureUserMangoPayUserAndWallet()
        .then(() => {
          this.isLoading = false;
          this.showBankForm = true;
          this.isSellingEnabled = true; // Ensure these are set correctly
          console.log('isSellingEnabled:', this.isSellingEnabled);
          console.log('showBankForm:', this.showBankForm);
        })
        .catch((error) => {
          this.isLoading = false;
          console.error('Error enabling selling:', error);
        });
    }
  }
  
  // simulate() {
  //   this.paymentService.simulateKycDocument('userId', this.documentId, this.status).subscribe({
  //     next: (res) => console.log('Simulation response:', res),
  //     error: (err) => console.error('Error:', err),
  //   });
  // }
  async ensureUserMangoPayUserAndWallet() {
    // Ensure the currentUser is defined before proceeding
    if (!this.currentUser) {
      throw new Error('No current user available');
    }
  
    // Check if the user has a MangoPay ID
    if (!this.currentUser.mangopay_id) {
      this.paymentService.createStoreMangoPayUser(this.currentBlog._id).subscribe({
        next:(response) => {
          // Handle success
          console.log('Successfully creating store mongoUser:', response );

          if (!this.currentUser.mangopayWalletId && this.currentUser.mangopay_id) {
            // Create wallet
            const wallet = this.paymentService.createWallet(this.currentUser.mangopay_id).subscribe({
             next:(response) => {
                // Handle success
                console.log('Successfully creating wallet:', response );

                this.isLoading = false;
              },
              error:(error) => {
                // Handle error
                this.isLoading = false;
                console.error('wallet step // Error enabling selling:', error);
              }
          });
            // Update currentUser with new mangopayWalletId
          }
        
          // Che
        },
        error:(error) => {
          // Handle error
          this.isLoading = false;
          console.error('Error enabling selling:', error);
        }
      }

      );

    }

  }
  
  registerBankAccount() {
    if (!this.bankAccountDetails.iban || !this.bankAccountDetails.bic) {
      alert('Please provide both IBAN and BIC.');
      return;
    }

    this.isLoading = true;
    this.paymentService
      .registerBlogBankAccount(this.currentBlog._id, this.bankAccountDetails)
      .subscribe(
        (response) => {
          this.isLoading = false;
          alert('Bank account registered successfully.');
          this.currentBlog.bankMangoPayId = response.Id;
          this.isSellingEnabled = true;
          this.showBankForm = false;
          this.blogService
            .updateBlog(this.currentBlog._id, { bankMangoPayId: response.Id })
            .subscribe({
              next:() => {
                // Successfully updated
                // You can now enable the blog to start selling products
                console.log('updated successfully youve done this');

              },
              error:(error) => {
                console.error('Error updating blog:', error);
              }
        });
        },
        (error) => {
          this.isLoading = false;
          console.error('Error registering bank account:', error);
          alert('Failed to register bank account. Please try again.');
        }
      );
  }

  disableSelling() {
    this.isLoading = true;
    // Remove the bankMangoPayId from the blog
    if(this.currentBlog.bankMangoPayId)
    {
    this.blogService.updateBlog(this.currentBlog._id, { bankMangoPayId: null }).subscribe({
      next:(response) => {
        this.isLoading = false;
        this.isSellingEnabled = false;
        alert('Selling has been disabled.');
      },
      error:(error) => {
        this.isLoading = false;
        console.error('Error disabling selling:', error);
        alert('Failed to disable selling. Please try again.');
      }
     } );
  }
  }




  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.base64File = (reader.result as string).split(',')[1]; // Removes the prefix
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  uploadKycDocument() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }
  
    const formData = new FormData();
    if(this.currentUser.mangopay_id){
    formData.append('file', this.selectedFile);
    formData.append('userId', this.currentUser.mangopay_id);
    formData.append('documentType', 'IDENTITY_PROOF');
  
    this.isLoading = true;
    this.paymentService.uploadKycDocument(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('KYC document uploaded successfully');
        this.showBankForm = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error uploading KYC document:', error);
        alert('Failed to upload KYC document. Please try again.');
      }
    });
  }
} 
}
