import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../core/services/cart.service';
import { OrderService } from '../core/services/order.service';
import { ArticlesComponent } from './blog/articles/articles.component';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { CommentsComponent } from './blog/comments/comments.component';
import { ArticlesByUserComponent } from './blog/articles-by-user/articles-by-user.component';
import { ArticleDetailsComponent } from './blog/article-details/article-details.component';
import { CreateArticleComponent } from './blog/create-article/create-article.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ConfirmationDialogComponent } from './blog/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommentComponent } from './blog/comment/comment.component';
import {  } from '../core/utils/pipes/is-draft-filter.pipe';
import { RegisterMainPageComponent } from './auth/register-main-page/register-main-page.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { ProfileComponent } from './profile/profile.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { RegisterStoreComponent } from './auth/register-store/register-store.component';
import { StoreDetailsComponent } from './stores/store-details/store-details.component';
import { ReviewFormComponent } from './stores/review-form/review-form.component';
import { ReviewListComponent } from './stores/review-list/review-list.component';
import { OrderByMerchantComponent } from './order/order-by-merchant/order-by-merchant.component';
import { OrderByIndividualComponent } from './order/order-by-individual/order-by-individual.component';
import { SponatnousJobApplicationComponent } from './recruitment/jobApplicaion/sponatnous-job-application/sponatnous-job-application.component';
import { JobApplicationFormComponent } from './recruitment/jobApplicaion/job-application-form/job-application-form.component';
import { JobOfferFormComponent } from './recruitment/jobOffer/job-offer-form/job-offer-form.component';
import { JobOffersComponent } from './recruitment/job-offers/job-offers.component';
import { JobOfferDetailsComponent } from './recruitment/jobOffer/job-offer-details/job-offer-details.component';
import { JobOffersByUserComponent } from './recruitment/jobOffer/job-offers-by-user/job-offers-by-user.component';
import { TwoFactorAuthentificationComponent } from './auth/two-factor-authentification/two-factor-authentification.component';
import { TwoFaVerificationComponent } from './auth/two-fa-verification/two-fa-verification.component';
import { TwoFactorSettingsComponent } from './auth/two-factor-settings/two-factor-settings.component';
import { DiscountFormComponent } from './discounts/discount-form/discount-form.component';
import { DiscountsListComponent } from './discounts/discount-list/discount-list.component';
import { SettingsComponent } from './settings/settings.component';
import { InvitationFormComponent } from './referrals/invitation-form/invitation-form.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { BuyTokensComponent } from './tokens/buy-tokens/buy-tokens.component';
import { PaymentStatusForTokenComponent } from './tokens/payment-status-for-token/payment-status-for-token.component';
import { DiscountCreateComponent } from './discounts/discount-create/discount-create.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    FrontOfficeComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ArticlesComponent,
    CommentsComponent,
    ArticlesByUserComponent,
    ArticleDetailsComponent,
    CreateArticleComponent,
    ConfirmationDialogComponent,
    CommentComponent,
    RegisterMainPageComponent,
    ProfileComponent,
    WishListComponent,
    RegisterStoreComponent,
    StoreDetailsComponent,
    ReviewFormComponent,
    ReviewListComponent,
    OrderByMerchantComponent,
    OrderByIndividualComponent,
    SponatnousJobApplicationComponent,
    JobApplicationFormComponent,
    JobOfferFormComponent,
    JobOffersComponent,
    JobOfferDetailsComponent,
    JobOffersByUserComponent,
    TwoFactorAuthentificationComponent,
    TwoFaVerificationComponent,
    TwoFactorSettingsComponent,
    DiscountFormComponent,
    DiscountsListComponent,
    SettingsComponent,
InvitationFormComponent,
BuyTokensComponent,

PaymentStatusForTokenComponent,
  DiscountCreateComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorModule,
    FormsModule,
    FrontOfficeRoutingModule,
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    MarketplaceModule,
    NgxIntlTelInputModule,
    ClipboardModule,
    NgSelectModule,

    
    

    
],
  
  providers:[ CartService,OrderService]
})
export class FrontOfficeModule { }
