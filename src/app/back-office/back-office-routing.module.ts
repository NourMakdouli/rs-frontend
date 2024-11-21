import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office.component';
import { ProductListComponent } from '../front-office/products/product-list/product-list.component';
import { ProductFormComponent } from '../front-office/products/product-form/product-form.component';
import { PayinsListComponent } from './Payments/payins-list/payins-list.component';

const routes: Routes = [{ path: '', component: BackOfficeComponent , children: [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'payment-list', component: PayinsListComponent },

{ path: '**', redirectTo: '/products' }
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
