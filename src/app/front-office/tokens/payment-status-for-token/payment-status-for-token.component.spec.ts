import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusForTokenComponent } from './payment-status-for-token.component';

describe('PaymentStatusForTokenComponent', () => {
  let component: PaymentStatusForTokenComponent;
  let fixture: ComponentFixture<PaymentStatusForTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentStatusForTokenComponent]
    });
    fixture = TestBed.createComponent(PaymentStatusForTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
