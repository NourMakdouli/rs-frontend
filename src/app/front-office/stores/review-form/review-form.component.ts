import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from 'src/app/core/models/review';
import { ReviewService } from 'src/app/core/services/review.service';
@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',

})
export class ReviewFormComponent implements OnInit {
  @Input() blogId!: string;
  @Input() userId!: string; 
  @Output() reviewSubmitted = new EventEmitter<void>(); // notify to refresh store details !
  stars: number[] = [5, 4, 3, 2, 1];
  isConnected: boolean = false; // Set to `true` if user is logged in

  reviewForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.isConnected = !!this.userId; // Assume user is connected if `userId` is provided

    this.reviewForm = this.fb.group({
      content: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]], // Default rating is 5
    });
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const reviewData: Review = {
        content: this.reviewForm.value.content,
        rating: Number(this.reviewForm.value.rating),
         // Ensure rating is a number
        author: this.userId,
        reviewedStore: this.blogId,
        upvotes: [],
      };

      this.reviewService.createReview(reviewData).subscribe({
        next:(response) => {
          console.log('Review submitted:', response);
          this.reviewForm.reset({ rating: 5 }); 
          this.reviewSubmitted.emit(); 
        },
        error:(error) => {
          console.error('Error submitting review:', error);
        }
        
      }

      );
    }
  }
}
