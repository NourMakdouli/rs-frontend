import { Component, OnInit, Input } from '@angular/core';
import { Review, ReviewPerStore } from 'src/app/core/models/review';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { ReviewService } from 'src/app/core/services/review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
})
export class ReviewListComponent implements OnInit {
  @Input() blogId!: string;
  currentUser: User | null = null;

  reviews: ReviewPerStore[] = [];
  showComments: boolean = true; 

  constructor(private reviewService: ReviewService,    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if(this.authService.isAuthenticated)
      {
        this.currentUser = this.authService.currentUserValue;
        console.log('Review Ya nawara Current User:', this.currentUser);

  
      }
            this.fetchReviews();
  }

  fetchReviews(): void {
    this.reviewService.getReviewsByStore(this.blogId).subscribe((data) => {
      this.reviews = data;
      console.log("this is the list of reviews",this.reviews)
    });
  }
  getStarsArray(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = (rating % 1) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('full'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  }
  deleteReview(reviewId: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this review?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReview(reviewId).subscribe(
          () => {
            // Remove the deleted review from the reviews array
            this.reviews = this.reviews.filter((review) => review._id !== reviewId);
            Swal.fire('Deleted', 'Your review has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting review:', error);
            Swal.fire('Error', 'An error occurred while deleting the review.', 'error');
          }
        );
      }
    });
  }
  
}
