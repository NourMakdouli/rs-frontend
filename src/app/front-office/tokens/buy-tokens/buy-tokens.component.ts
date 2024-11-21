import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { getBrowserInfo } from 'src/app/core/utils/browser-info';
import { CreateCardDirectPayInDto, MoneyDto } from 'src/app/core/models/payIn';
import { User } from 'src/app/core/models/user';
import { Router } from '@angular/router';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';

@Component({
  selector: 'app-buy-tokens',
  templateUrl: './buy-tokens.component.html',
})
export class BuyTokensComponent implements OnInit {
  buyTokensForm: FormGroup;
  userId: string;
  mangopay_id: string;
  mangopayWalletId: string;
  isLoading: boolean = false;
  costPerToken = 1; // 1 token = 1 EUR

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private toaster: ToastrService,
    private authService: AuthService,
    private router: Router,
    private formValidationService: FormValidationService
  ) {}


  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.userId = user._id;
        this.initBuyTokens(user);
      } else {
        this.toaster.info('You need to be logged in to buy tokens.');
        this.router.navigate(['/login']);
      }
    });
  
    this.buyTokensForm = this.fb.group({
      tokenAmount: [1, [Validators.required, Validators.min(1)]],
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpiration: ['', [Validators.required, Validators.pattern(/^\d{4}$/), this.formValidationService.expirationDateValidator()]], // MMYY
      cardCvx: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }
  

  initBuyTokens(user: User) {
    if (!user.mangopay_id) {
      this.paymentService.createMangopayUser(this.userId).subscribe({
        next: (response: any) => {
          this.mangopay_id = response.Id;
          this.checkAndCreateWallet(user);
        },
        error: (err) => {
          console.error('Error creating MangoPay user:', err);
          this.toaster.error('Error creating MangoPay user.', 'Error');
        },
      });
    } else {
      this.mangopay_id = user.mangopay_id;
      this.checkAndCreateWallet(user);
    }
  }
  checkAndCreateWallet(user: User) {
    if (!user.mangopayWalletId) {
      this.paymentService.createWallet(this.mangopay_id).subscribe({
        next: (walletResponse: any) => {
          this.mangopayWalletId = walletResponse.Id;
          console.log('User and wallet setup complete');
        },
        error: (err) => {
          console.error('Error creating MangoPay wallet:', err);
          this.toaster.error('Error creating MangoPay wallet.', 'Error');
        },
      });
    } else {
      this.mangopayWalletId = user.mangopayWalletId;
      console.log('User already has MangoPay Wallet ID');
    }
  }
  private isFormValid(): boolean {
    if (this.buyTokensForm.invalid) {
      this.toaster.error('Please fill out the form correctly.', 'Validation Error');
      return false;
    }
    return true;
  }
  
  onSubmit() {
    if (!this.isFormValid()) {
      console.error('Form is invalid');
      return;
    }
  
    const { tokenAmount, cardNumber, cardExpiration, cardCvx } = this.buyTokensForm.value;
    const amount = tokenAmount * this.costPerToken * 100; // Convert to cents
    const currency = 'EUR';
    const browserInfo = getBrowserInfo();
  
    this.handleCardRegistration(cardNumber, cardExpiration, cardCvx, amount, currency, browserInfo);
  }
  
  private handleCardRegistration(cardNumber: string, cardExpiration: string, cardCvx: string, amount: number, currency: string, browserInfo: any) {
    this.paymentService.createCardRegistration(this.userId).subscribe({
      next: (response: any) => {
        this.sendCardDetails(response, cardNumber, cardExpiration, cardCvx, amount, currency, browserInfo);
      },
      error: (err: any) => {
        console.error('Error during card registration creation:', err);
        this.toaster.error('Failed to create card registration.', 'Error');
      },
    });
  }
  

  private sendCardDetails(response: any, cardNumber: string, cardExpiration: string, cardCvx: string, amount: number, currency: string, browserInfo: any) {
    const { PreregistrationData, AccessKey, Id, CardRegistrationURL } = response;
  
    const cardDetails = {
      cardRegistrationId: Id,
      CardRegistrationURL,
      PreregistrationData,
      AccessKey,
      cardNumber,
      cardExpirationDate: cardExpiration,
      cardCvx,
    };
  
    this.paymentService.sendCardDetails(cardDetails).subscribe({
      next: (registrationData: string) => {
        if (registrationData.startsWith('errorCode=')) {
          const errorCode = registrationData.split('=')[1];
          this.toaster.error(`Payment error occurred. Error code: ${errorCode}`, 'Error');
          return;
        }
        this.finalizeCardRegistration(Id, registrationData, amount, currency, browserInfo);
      },
      error: (err: any) => {
        console.error('Error sending card details:', err);
        this.toaster.error('Failed to send card details.', 'Error');
      },
    });
  }
  
  private finalizeCardRegistration(cardRegistrationId: string, registrationData: string, amount: number, currency: string, browserInfo: any) {
    this.isLoading = true; // Show loading spinner
  
    this.paymentService.finalizeCardRegistration(cardRegistrationId, registrationData).subscribe({
      next: (finalizeResponse: any) => {
        this.isLoading = false; // Hide loading spinner
  
        if (finalizeResponse.success) {
          const cardId: string = finalizeResponse.card.Id;
          this.buyTokensPayIn(cardId, amount, currency, browserInfo);
        } else {
          this.toaster.error('Card registration failed.', 'Error');
        }
      },
      error: (err: any) => {
        this.isLoading = false; // Hide loading spinner
        console.error('Error finalizing card registration:', err);
        this.toaster.error('Failed to finalize card registration.', 'Error');
      },
    });
  }
  

  private buyTokensPayIn(cardId: string, amount: number, currency: string, browserInfo: any) {
    const payInDto = new CreateCardDirectPayInDto();
    payInDto.AuthorId = this.mangopay_id;
    payInDto.CardId = cardId;
    payInDto.DebitedFunds = new MoneyDto();
    payInDto.DebitedFunds.Amount = amount;
    payInDto.DebitedFunds.Currency = currency;
    payInDto.Fees = new MoneyDto();
    payInDto.Fees.Amount = 0;
    payInDto.Fees.Currency = currency;
    payInDto.BrowserInfo = browserInfo;
    payInDto.SecureModeReturnURL = 'http://localhost:4200/payment-status-token'; // Update as needed
  
    this.paymentService.buyTokens(payInDto).subscribe({
      next: (payInResponse: any) => {
        this.handlePayInResponse(payInResponse);
      },
      error: (err: any) => {
        console.error('Error buying tokens:', err);
        this.toaster.error('Failed to purchase tokens.', 'Error');
      },
    });
  }
  

  private handlePayInResponse(payInResponse: any) {
    const redirectionUrl = payInResponse.ExecutionDetails?.SecureModeRedirectURL;

    if (payInResponse.Status !== 'FAILED') {
      if (redirectionUrl) {
        window.location.href = redirectionUrl;
      } else {
        this.toaster.success('Token purchase succeeded.', 'Success');
        // Optionally, navigate to a confirmation page or update the user's token balance
      }
    } else {
      const resultCode = payInResponse.ResultCode;
      const resultMessage = payInResponse.ResultMessage;
      this.toaster.error(`Payment failed [${resultCode}]: ${resultMessage}`, 'Error');
      console.error(`Payment failed [${resultCode}]:`, payInResponse);
    }
  }
}
