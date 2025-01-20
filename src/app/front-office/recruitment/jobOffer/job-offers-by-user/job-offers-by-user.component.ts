import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as saveAs from 'file-saver';
import { Subscription } from 'rxjs';
import { DataTable } from 'simple-datatables';
import { JobApplication } from 'src/app/core/models/job-application';
import { JobOffer, JobOfferData } from 'src/app/core/models/job-offer';
import { Product } from 'src/app/core/models/product';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { JobApplicationService } from 'src/app/core/services/job-application.service';
import { JobOfferService } from 'src/app/core/services/job-offer.service';


@Component({
  selector: 'app-job-offers-by-user',
  templateUrl: './job-offers-by-user.component.html',
  styleUrls: ['./job-offers-by-user.component.css']
})
export class JobOffersByUserComponent implements OnInit, OnDestroy {
  jobOffers: JobOfferWithState[] = [];
  isLoadingOffers = false;
  errorLoadingOffers: string | null = null;
  currentUser: User | null = null;
  authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    private jobOfferService: JobOfferService,
    private jobApplicationService: JobApplicationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Get current user
    this.currentUser = this.authService.currentUserValue;

    // Subscribe to auth status changes
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(() => {
      this.currentUser = this.authService.currentUserValue;

      // If user and store are now available, load job offers
      if (this.currentUser && this.currentUser.store) {
        this.loadJobOffers(this.currentUser.store);
      }
    });

    // If currentUser and store are already available, load job offers
    if (this.currentUser && this.currentUser.store) {
      this.loadJobOffers(this.currentUser.store);
    } else {
      // Handle case where user or store is not immediately available
      console.warn('User or store information is missing. Waiting for authentication...');
    }
  }

  ngOnDestroy() {
    if (this.authListenerSubs) {
      this.authListenerSubs.unsubscribe();
    }
  }

  loadJobOffers(storeId: string) {
    this.isLoadingOffers = true;
    this.errorLoadingOffers = null;

    this.jobOfferService.getJobOffersByStore(storeId).subscribe(
      (offers) => {
        this.jobOffers = offers.map((offer) => ({
          ...offer,
          isExpanded: false,
          isLoadingApplications: false,
          applications: [],
          errorLoadingApplications: null,
        }));
        this.isLoadingOffers = false;
      },
      (error) => {
        console.error('Error loading job offers', error);
        this.errorLoadingOffers = 'Failed to load job offers.';
        this.isLoadingOffers = false;
      }
    );
  }

  toggleApplications(jobOffer: JobOfferWithState) {
    jobOffer.isExpanded = !jobOffer.isExpanded;

    if (jobOffer.isExpanded && jobOffer.applications.length === 0) {
      // Fetch applications if not already loaded
      this.loadApplications(jobOffer);
    }
  }

  loadApplications(jobOffer: JobOfferWithState) {
    jobOffer.isLoadingApplications = true;
    jobOffer.errorLoadingApplications = null;

    this.jobApplicationService.getApplicationsByJobOffer(jobOffer?._id).subscribe(
      (applications) => {
        jobOffer.applications = applications;
        jobOffer.isLoadingApplications = false;
      },
      (error) => {
        console.error(`Error loading applications for job offer ${jobOffer._id}`, error);
        jobOffer.errorLoadingApplications = 'Failed to load applications.';
        jobOffer.isLoadingApplications = false;
      }
    );
  }
  downloadResume(resumeUrl: string, applicant: JobApplication) {
    if (!resumeUrl) {
      console.error('Resume URL is undefined');
      return;
    }
  
    this.http.get(resumeUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        const firstname = applicant.firstname || 'Unknown';
        const lastname = applicant.lastname || 'Applicant';
        const filename = `${firstname}_${lastname}_CV.${this.getFileExtension(resumeUrl)}`;
        saveAs(blob, filename);
      },
      (error) => {
        console.error('Error downloading resume', error);
        // Optionally display an error message
      }
    );
  }
  
  

  getFileExtension(url: string): string {
    return url.split('.').pop()?.split('?')[0] || 'pdf';
  }
  viewApplication(application: JobApplication) {
    // Implement viewing application details, e.g., open a modal
  }
}

interface JobOfferWithState extends JobOffer {
  isExpanded: boolean;
  isLoadingApplications: boolean;
  applications: JobApplication[];
  errorLoadingApplications: string | null;
}
