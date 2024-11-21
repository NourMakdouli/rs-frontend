import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountFormComponent } from './discount-form.component';

describe('DiscountFormComponent', () => {
  let component: DiscountFormComponent;
  let fixture: ComponentFixture<DiscountFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountFormComponent]
    });
    fixture = TestBed.createComponent(DiscountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
