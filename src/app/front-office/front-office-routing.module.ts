import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ArticlesComponent } from './blog/articles/articles.component';
import { ArticleDetailsComponent } from './blog/article-details/article-details.component';
import { CreateArticleComponent } from './blog/create-article/create-article.component';
import { canDeactivateGuard } from '../core/helpers/canDecativate.guard';
import { ArticlesByUserComponent } from './blog/articles-by-user/articles-by-user.component';
import { RegisterMainPageComponent } from './auth/register-main-page/register-main-page.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { ProfileComponent } from './profile/profile.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { RegisterStoreComponent } from './auth/register-store/register-store.component';
import { StoreDetailsComponent } from './stores/store-details/store-details.component';
import { OrderByIndividualComponent } from './order/order-by-individual/order-by-individual.component';
import { OrderByMerchantComponent } from './order/order-by-merchant/order-by-merchant.component';
import { JobApplicationFormComponent } from './recruitment/jobApplicaion/job-application-form/job-application-form.component';
import { JobOfferFormComponent } from './recruitment/jobOffer/job-offer-form/job-offer-form.component';
import { JobOfferDetailsComponent } from './recruitment/jobOffer/job-offer-details/job-offer-details.component';
import { JobOffersByUserComponent } from './recruitment/jobOffer/job-offers-by-user/job-offers-by-user.component';
import { TwoFaVerificationComponent } from './auth/two-fa-verification/two-fa-verification.component';
import { TwoFactorSettingsComponent } from './auth/two-factor-settings/two-factor-settings.component';
import { DiscountFormComponent } from './discounts/discount-form/discount-form.component';
import { DiscountsListComponent } from './discounts/discount-list/discount-list.component';
import { SettingsComponent } from './settings/settings.component';
import { InvitationFormComponent } from './referrals/invitation-form/invitation-form.component';
import { BuyTokensComponent } from './tokens/buy-tokens/buy-tokens.component';
import { PaymentStatusForTokenComponent } from './tokens/payment-status-for-token/payment-status-for-token.component';
import { DiscountCreateComponent } from './discounts/discount-create/discount-create.component';
import { ReviewListComponent } from './stores/review-list/review-list.component';

const routes: Routes = [
  {
    path: '', component: FrontOfficeComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },{ path: 'register', component: RegisterMainPageComponent },
      { path: 'register/:accountType', component: RegisterComponent },
      { path: 'register/:accountType', component: RegisterComponent, pathMatch: 'full' },
      
      { path: '2fa-verification', component: TwoFaVerificationComponent },

      { path: 'two-factor-settings', component: TwoFactorSettingsComponent },

      { path: 'discounts', component: DiscountsListComponent },
      { path: 'discounts/create', component: DiscountCreateComponent },
      { path: 'invitation', component: InvitationFormComponent },

      { path: 'discounts/edit/:id', component: DiscountFormComponent },


      { path: 'register-store', component: RegisterStoreComponent },

      { path: 'articles', component: ArticlesComponent },
      { path: 'articlesByUser', component: ArticlesByUserComponent },
      { path: 'article-details/:id', component: ArticleDetailsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'productsByUser', component: ProductListComponent },
      { path: 'product-create', component: ProductFormComponent },
      { path: 'product-edit/:id', component: ProductFormComponent },
      { path: 'wishlist', component: WishListComponent },
      { path: 'orders-by-individual', component: OrderByIndividualComponent },
      { path: 'orders-by-merchant', component: OrderByMerchantComponent },
      { path: 'job-application', component: JobApplicationFormComponent },
      { path: 'job-offer-create', component: JobOfferFormComponent },
      { path: 'job-offer-details/:id', component: JobOfferDetailsComponent },
      { path: 'job-offers-by-merchant', component: JobOffersByUserComponent },
      { path: 'profile-settings', component: SettingsComponent },

      

    
      { path: 'buy-tokens', component: BuyTokensComponent },
      { path: 'payment-status-token', component: PaymentStatusForTokenComponent },
      { path: 'store-details/:id', component: StoreDetailsComponent },

      {
        path: 'create-article',
        component: CreateArticleComponent,
        canDeactivate: [canDeactivateGuard],
      },



      { path: 'marketplace', loadChildren: () => import('./marketplace/marketplace.module').then(m => m.MarketplaceModule) }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
