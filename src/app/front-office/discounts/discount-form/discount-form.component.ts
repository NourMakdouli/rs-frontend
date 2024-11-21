import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscountService } from 'src/app/core/services/discount.service';

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.css']
})
export class DiscountFormComponent implements OnInit {
  discountForm: FormGroup;
  isEditMode = false;
  discountId: string;

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.discountId = params['id'];
        this.isEditMode = true;
        this.getDiscount(this.discountId);
      }
    });
  }

  initForm() {
    this.discountForm = this.fb.group({
      type: ['product', Validators.required],  // 'product' | 'products' | 'store'
      percentage: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      products: [[]],  // Array of product IDs (if applicable)
      store: [null],   // Store ID (if applicable)
    });
  }

  // Get discount by ID for edit mode
  getDiscount(id: string) {
    this.discountService.getDiscountById(id).subscribe((discount) => {
      this.discountForm.patchValue(discount);
    });
  }

  // Submit form to create or update discount
  onSubmit() {
    if (this.discountForm.invalid) {
      return;
    }

    const discountData = this.discountForm.value;

    if (this.isEditMode) {
      this.discountService.updateDiscount(this.discountId, discountData).subscribe(() => {
        this.router.navigate(['/discounts']);  // Redirect to discounts list
      });
    } else {
      this.discountService.createDiscount(discountData).subscribe(() => {
        this.router.navigate(['/discounts']);
      });
    }
  }
}
