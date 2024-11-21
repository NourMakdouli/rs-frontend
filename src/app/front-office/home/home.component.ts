import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product';
import Swal from "sweetalert2";
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class HomeComponent implements OnInit{
  products: Product[] = [];
  currentSection: string = '';
loggedIn:boolean=false;
user: User | null ;

  constructor(private productService: ProductService,private authService: AuthService) {}

  ngOnInit(): void {
    console.log('User is connected:',this.authService.isAuthenticated);

    if(this.authService.isAuthenticated)
    {
      this.user = this.authService.currentUserValue;
      console.log('Current User:', this.user);
      this.loggedIn=this.authService.isAuthenticated;
      console.log('Logged In:', this.loggedIn);

    }
      
    
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      console.log('here are all the products',this.products)
    });


    
  }
  showSection(section: string) {
    this.currentSection = section;
  }





}
