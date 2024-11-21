import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { InvitationService } from 'src/app/core/services/invitation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invitation-form',
  templateUrl: './invitation-form.component.html',
  styleUrls: ['./invitation-form.component.css'],
})
export class InvitationFormComponent implements OnInit, OnDestroy {
  inviteForm: FormGroup;
  referralLink: string;
  isLinkCopied = false;
  id: string;
  private authSubscription: Subscription;

  user: User | null = null;
  loggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private invitationService: InvitationService,
    private clipboard: Clipboard,
    private authService: AuthService,
    private usersService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    console.log(" ngOnInit: referral code:", this.referralLink);
  
    if (this.user) {
      this.id = this.user._id;
      console.log(" this.id", this.user._id);
  
      // Now that this.id is set, call getReferralLink()
      this.getReferralLink();
    } else {
      this.router.navigate(['/login']);
    }
  
    this.inviteForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['']
    });
  }
  

  getReferralLink(): void {
    if (this.id) {
      this.usersService.getProfile(this.id).subscribe({
        next: (response) => {
          console.log("response:", response);
          const { user, referralCode } = response;
          this.referralLink = `${window.location.origin}/register?referralCode=${referralCode}`;
          console.log("Updated referralLink:", this.referralLink);
          
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
        },
      });
    } else {
      console.error('Error fetching user + referral code:');
    }
  }
  
  
  

  onSubmit() {
    if (this.inviteForm.valid) {
      const invitationData = {
        ...this.inviteForm.value,
        referralLink: this.referralLink,
      };
    
      this.invitationService.sendInvitation(invitationData).subscribe({
        next: (response) => {
          alert('Invitation sent successfully!');
          this.inviteForm.reset();
        },
        error: (error) => {
          console.error('Error sending invitation:', error);
          alert('There was an error sending the invitation.');
        }
      });
    }
  }

  copyReferralLink(): void {
    if (this.referralLink) {
      navigator.clipboard.writeText(this.referralLink).then(
        () => {
          this.isLinkCopied = true;
          setTimeout(() => (this.isLinkCopied = false), 2000);
        },
        (err) => {
          console.error('Could not copy text: ', err);
        }
      );
    }
  }


  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
}
}
