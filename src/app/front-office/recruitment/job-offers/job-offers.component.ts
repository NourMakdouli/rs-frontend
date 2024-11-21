import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharacterLimitPipe } from 'src/app/core/utils/pipes/character-limit.pipe';
import { JobOfferFormComponent } from '../jobOffer/job-offer-form/job-offer-form.component';
import { JobOfferService } from 'src/app/core/services/job-offer.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JobOffer, JobOfferData } from 'src/app/core/models/job-offer';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css'],
  providers: [CharacterLimitPipe] 

})
export class JobOffersComponent implements OnInit, OnDestroy {
  jobOffersList: JobOfferData[]=[];
  visibleJobOffers:JobOfferData[]=[];
  numberOfJobOffersToShow = 8;
  jobOffersFound:number=0;
  currentUser: User | null;
  private authListenerSubs: Subscription;




constructor(private jobOfferService: JobOfferService,     private authService: AuthService,
  private sanitizer: DomSanitizer, private characterLimitPipe: CharacterLimitPipe,private router:Router,    private toastr: ToastrService

){
  this.currentUser = null;

}
ngOnDestroy(): void {
  if (this.authListenerSubs) {
    this.authListenerSubs.unsubscribe();
  }
}


ngOnInit(): void {
  this.currentUser = this.authService.currentUserValue;
  this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(() => {
    this.currentUser = this.authService.currentUserValue;
  });
  this.getAllJobOffers();
    
}
  getAllJobOffers() {
    this.jobOfferService.getJobOffers().subscribe({
      next:(jobOffers) => {
        this.jobOffersList=jobOffers;
        this.jobOffersFound=jobOffers.length;
        console.log('Number of job Offers found',this.jobOffersFound);
        console.log('Job Offers',this.jobOffersList);


      },
      error:(err)=> {
        console.log(err);
      },
    });
    }
    getLimitedDescription(description: string, limit: number): SafeHtml {
      const limitedDescription = this.characterLimitPipe.transform(description, limit);
      return this.sanitizer.bypassSecurityTrustHtml(limitedDescription);
    }
    onPostJobAd() {
      const user = this.currentUser;
  
      if (user && user.role === 'MERCHANT') {
        this.router.navigate(['/job-offer-create']);
      } else if (user) {
        // User is authenticated but not a merchant
        this.toastr.error('Vous devez être un commerçant pour déposer une annonce.', 'Accès refusé', {
          progressBar: true,
          closeButton: true,
        });
      } else {
        // User is not authenticated
        this.router.navigate(['/login']);
      }
    }
}
