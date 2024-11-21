import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { SharedModule } from '../shared/shared.module';
import { ProductListComponent } from '../front-office/products/product-list/product-list.component';
import { ProductFormComponent } from '../front-office/products/product-form/product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PayinsListComponent } from './Payments/payins-list/payins-list.component';


@NgModule({
  declarations: [
    BackOfficeComponent,
    PayinsListComponent,

  ],
  imports: [
    CommonModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    BackOfficeRoutingModule,
    SharedModule]
})
export class BackOfficeModule { }
