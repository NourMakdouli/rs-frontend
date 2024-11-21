import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderByMerchantComponent } from './order-by-merchant.component';

describe('OrderByMerchantComponent', () => {
  let component: OrderByMerchantComponent;
  let fixture: ComponentFixture<OrderByMerchantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderByMerchantComponent]
    });
    fixture = TestBed.createComponent(OrderByMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
