// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCardDirectPayInDto, PayIn } from '../models/payIn';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = `${environment.API_URL}/mangopay`;


  constructor(private http: HttpClient) {}

  // Method to create MangoPay user
  createMangopayUser(appUserId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-user`, { appUserId });
  }
  getPayInsToBePaidOut(): Observable<PayIn[]> {
    return this.http.get<PayIn[]>(`${this.baseUrl}/payins-to-be-paid-out`);
  }

  initiatePayoutForPayIn(payInId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/initiate-payout/${payInId}`, {});
  }



  getPayoutAutomationStatus(): Observable<{ isAutomated: boolean }> {
    return this.http.get<{ isAutomated: boolean }>(`${environment.API_URL}/payout-automation-status`);
  }

  // Update automation setting
  updatePayoutAutomationStatus(isAutomated: boolean): Observable<any> {
    return this.http.put(`${environment.API_URL}/payout-automation-status`, { isAutomated });
  }
  
  // Method to create a wallet for the MangoPay user
 // Frontend Service: PaymentService
createWallet(userId: string, currency: string = 'EUR'): Observable<any> {
  return this.http.post(`${this.baseUrl}/create-wallet`, { userId, currency });
}

  // Method to create a card registration object
  createCardRegistration(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-card-registration`, { userId });
  }

  // Method to send card details
// payment.service.ts

sendCardDetails(cardDetails: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/send-card-details`, cardDetails, { responseType: 'text' }).pipe(
    map((response: string) => {
      if (response.startsWith('errorCode=')) {
        throw new Error(`Tokenization error: ${response}`);
      }
      return response;
    })
  );
}

  

  finalizeCardRegistration(cardRegistrationId: string, registrationData: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/finalize-card-registration`, {
      cardRegistrationId,
      registrationData,
    }).pipe(
      map((response: any) => {
        console.log('this is in the finalize-card-registration in front service Finalization Response:', response);
        if (response.success) {
          console.log(response,)
          return response;
        } else {
          throw new Error(response.ResultMessage || 'Card registration failed');
        }
      })
    );
  }
  

  // Method to retrieve card registration details
  getCardRegistration(cardRegistrationId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/card-registration/${cardRegistrationId}`);
  }

  createCardDirectPayIn(payInDto: CreateCardDirectPayInDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-payin`, payInDto);
  }
  checkPayInStatus(payInId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/check-payin-status`, { payInId });
  }

createStoreMangoPayUser(storeId: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/store-user/${storeId}`, {});
}


  // New Method to create a payout to a store's bank account
  createPayoutToStoreBankAccount(storeId: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/store-payout/${storeId}`, { amount });
  }

  // New Method to get all pay-ins for a specific store
  getPayInsByStore(storeId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/store/${storeId}/payins`);
  }

// Method to register the blog's bank account
registerBlogBankAccount(blogId: string, bankAccountDetails: { iban: string; bic: string }): Observable<any> {
  return this.http.post(`${this.baseUrl}/blog-bank-account/${blogId}`, bankAccountDetails);
}


buyTokens(payInDto: CreateCardDirectPayInDto): Observable<any> {
  return this.http.post(`${this.baseUrl}/buy-tokens`, payInDto);
}

uploadKycDocument(formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/kyc`, formData);
}

simulateKycDocument(userId: string, documentId: string, status: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/simulate-kyc-document`, { userId, documentId, status });
}
}