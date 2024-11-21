import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceComponent } from './marketplace.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { ProductsComponent } from './products/products.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { HomeComponent } from '../home/home.component';
import { StoresComponent } from './stores/stores.component';

const routes: Routes = [{ path: '', component: HomeComponent },
{ path: 'cart', component: CartComponent },
{ path: 'order', component: OrderComponent },
{ path: 'payment', component: CartComponent },
{ path: 'product/:id', component: ProductDetailsComponent },
 { path: 'stores', component: StoresComponent },
{ path: 'products', component: ProductsComponent },
{ path: 'discounts', component: DiscountsComponent },
{ path: 'checkout/:id', component: CheckoutComponent },
{ path: 'payment-status', component:PaymentStatusComponent},
{ path: 'payment-success', component:PaymentSuccessComponent},




//  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }





