import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { MarketplaceComponent } from './marketplace.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { AppModule } from 'src/app/app.module';
import { CharacterLimitPipe } from 'src/app/core/utils/pipes/character-limit.pipe';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { SharedModule } from "../../shared/shared.module";
import { StoresComponent } from './stores/stores.component';


@NgModule({
  declarations: [
    MarketplaceComponent,
    ProductDetailsComponent,
    CartComponent,
    ProductsComponent,
    DiscountsComponent,
    CheckoutComponent,
    PaymentStatusComponent,
    PaymentSuccessComponent,
    StoresComponent,
  ],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    ReactiveFormsModule, FormsModule,
    SharedModule
],
  exports: [
    ProductsComponent,
    DiscountsComponent,
    StoresComponent,

  ]

})
export class MarketplaceModule { }
