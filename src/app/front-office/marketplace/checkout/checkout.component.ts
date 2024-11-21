import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/core/models/order';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
import { PaymentService } from 'src/app/core/services/payment.service';
import { getBrowserInfo } from 'src/app/core/utils/browser-info';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateCardDirectPayInDto, MoneyDto } from 'src/app/core/models/payIn';
import { User } from 'src/app/core/models/user';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  itemCartsNumber:number=0;
  public pendingOrder: Order;
  userId: string;
  isLoading: boolean = false; // Control loading spinner visibility
orderId:string;
  mangopay_id:string;
  mangopayWalletId:string;
  selectedCardType: any = null;

  // List of card types with images
  cardTypes = [
    { name: 'Visa', image: 'assets/images/visa.png' },
    { name: 'MasterCard', image: 'assets/images/mastercard.png' },
    { name: 'American Express', image: 'assets/images/amex.png' }
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private orderService: OrderService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router,

    private formValidationService: FormValidationService) 
 {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['id'];
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.userId = user._id;  
        console.log('Extracting the userId from the currentUser object', this.userId);
        
        this.getPendingOrders(this.orderId);
  
        this.initCheckout(user);
      } else {
        this.toaster.info('You need to be logged-in in order to checkout.');
        console.log('No user found, redirecting to login...');
        this.router.navigate(['/login']);
      }
    });
  
  
    
    this.checkoutForm = this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpiration: ['', [Validators.required, Validators.pattern(/^\d{4}$/), this.formValidationService.expirationDateValidator()]],  // MMYY
      cardCvx: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
    
    }
    


  
  initCheckout(user: User) {
    console.log('1',user.mangopay_id);
    if (!user.mangopay_id) {
      this.paymentService.createMangopayUser(this.userId).subscribe({
        next: (response: any) => {
          this.mangopay_id = response.Id;  
          this.checkAndCreateWallet(user);  
        },
        error: (err) => {
          console.error('Error creating MangoPay user:', err);
          this.toaster.error('Error creating MangoPay user.', 'Error');
        }
      });
    } else {
      this.mangopay_id = user.mangopay_id;
      console.log('user already has a mangopay User account');
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
        }
      });
    } else {
      console.log('User already has MangoPay Wallet ID');
    }
  }
  
  
  
  onSubmit() {
    if (!this.isFormValid()) {
      console.error('Form is invalid');
      return;
    }
  
    const { cardNumber, cardExpiration, cardCvx } = this.checkoutForm.value;
    const amount = this.pendingOrder.totalPrice * 100;
    const currency = 'EUR';
    const browserInfo = getBrowserInfo();
  
    this.handleCardRegistration(cardNumber, cardExpiration, cardCvx, amount, currency, browserInfo);
  }
  
  private isFormValid(): boolean {
    if (this.checkoutForm.invalid) {
      this.toaster.error('Please fill out the form correctly.', 'Validation Error');
      return false;
    }
    return true;
  }
  
  private handleCardRegistration(cardNumber: string, cardExpiration: string, cardCvx: string, amount: number, currency: string, browserInfo: any) {
    this.paymentService.createCardRegistration(this.userId).subscribe({
      next: (response: any) => {
        this.sendCardDetails(response, cardNumber, cardExpiration, cardCvx, amount, currency, browserInfo);
      },
      error: (err: any) => {
        console.error('Error during card registration creation:', err);
        this.toaster.error('Failed to create card registration.', 'Error');
      }
    });
  }
  
 // checkout.component.ts

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
    }
  });
}

  
  private finalizeCardRegistration(cardRegistrationId: string, registrationData: string, amount: number, currency: string, browserInfo: any) {
    this.isLoading = true; // Show loading spinner

    this.paymentService.finalizeCardRegistration(cardRegistrationId, registrationData).subscribe({
      next: (finalizeResponse: any) => {
        this.isLoading = false; // Hide loading spinner

        if (finalizeResponse.success) {
          console.log('finalizedResponse to see the position of the cardId:', finalizeResponse);
  
          // Create a constant string for the CardId
          const cardId: string = finalizeResponse.card.Id;
          console.log('CardId:', cardId);
  
          // Proceed with PayIn creation using the valid CardId
          this.createPayIn(cardId, amount, currency, browserInfo);
        } else {
          this.toaster.error('Card registration failed.', 'Error');
        }
      },
      error: (err: any) => {
        this.isLoading = false; // Hide loading spinner
        console.error('Error finalizing card registration:', err);
        this.toaster.error('Failed to finalize card registration.', 'Error');
      }
    });
  }
  
  
  private createPayIn(cardId: string, amount: number, currency: string, browserInfo: any) {
    const payInDto = new CreateCardDirectPayInDto();
    payInDto.AuthorId = this.mangopay_id;
    payInDto.CardId =cardId;
    payInDto.DebitedFunds = new MoneyDto();
    payInDto.DebitedFunds.Amount = amount;
    payInDto.DebitedFunds.Currency = currency;
    payInDto.Fees = new MoneyDto();
    payInDto.Fees.Amount = 0;
    payInDto.Fees.Currency = currency;
    payInDto.BrowserInfo = browserInfo;
    payInDto.SecureModeReturnURL = 'http://localhost:4200/marketplace/payment-status';
  console.log('this is the payinDTO before processing it',payInDto);
    this.paymentService.createCardDirectPayIn(payInDto).subscribe({
      next: (payInResponse: any) => {
        this.handlePayInResponse(payInResponse);
      },
      error: (err: any) => {
        console.error('Error creating PayIn:', err);
        this.toaster.error('Failed to create payment.', 'Error');
      }
    });
  }
  
  private handlePayInResponse(payInResponse: any) {
    const redirectionUrl = payInResponse.ExecutionDetails?.SecureModeRedirectURL;
    const payInId = payInResponse.Id;
    localStorage.setItem('payInId', payInId);
    localStorage.setItem('orderId', this.pendingOrder._id);

  
    if (payInResponse.Status !== 'FAILED') {
      if (redirectionUrl) {
        window.location.href = redirectionUrl;
      } else {
        this.toaster.success('Payment succeeded without 3D Secure.', 'Success');
        this.router.navigate(['/marketplace/payment-status']);
      }
    } else {

      const resultCode = payInResponse.ResultCode;
      const resultMessage = payInResponse.ResultMessage;
      this.toaster.error(`Payment failed [${resultCode}]: ${resultMessage}`, 'Error');
      console.error(`Payment failed [${resultCode}]:`, payInResponse);    }
  }
  

  

  getPendingOrders(id: string) {
    this.orderService.getOrderById(id).subscribe({
      next: (order: Order | null) => {
        if (order) {
          this.pendingOrder = order;
          this.itemCartsNumber=this.pendingOrder.cartItems.length;
          console.log("This is the pending order");
        } else {
          console.error('No pending order found for the user.');
        }
      },
      error: (err) => {
        console.error('Error fetching pending order:', err);
      }
    });
  }


}


