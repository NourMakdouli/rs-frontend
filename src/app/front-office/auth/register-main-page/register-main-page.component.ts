import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-main-page',
  templateUrl: './register-main-page.component.html',
  styleUrls: ['./register-main-page.component.css']
})
export class RegisterMainPageComponent implements OnInit{
  referralCode:string | null=null;

constructor(private route:ActivatedRoute,private router:Router){}


ngOnInit(): void {
  // Capture the referral code from the query parameters
  this.route.queryParams.subscribe(params => {
    this.referralCode = params['referralCode'] || null;

    console.log("Referral Code: ",this.referralCode);
  });
}

// Methods to navigate to the registration form
registerAsMerchant() {
  this.router.navigate(['/register', 'MERCHANT'], { queryParams: { referralCode: this.referralCode } });
}

registerAsIndividual() {
  this.router.navigate(['/register', 'INDIVIDUAL'], { queryParams: { referralCode: this.referralCode } });
}

}
