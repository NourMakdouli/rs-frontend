import { Component, OnInit } from '@angular/core';
import { DiscountService } from 'src/app/core/services/discount.service';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.css']
})
export class DiscountsListComponent implements OnInit {
  discounts: any[] = [];

  constructor(private discountService: DiscountService) {}

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts() {
    this.discountService.getAllDiscounts().subscribe((data) => {
      this.discounts = data;
    });
  }

  deleteDiscount(id: string) {
    this.discountService.deleteDiscount(id).subscribe(() => {
      this.loadDiscounts();  // Reload discounts after deletion
    });
  }
}