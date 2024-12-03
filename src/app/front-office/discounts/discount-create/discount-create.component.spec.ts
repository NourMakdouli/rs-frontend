import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCreateComponent } from './discount-create.component';

describe('DiscountCreateComponent', () => {
  let component: DiscountCreateComponent;
  let fixture: ComponentFixture<DiscountCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountCreateComponent]
    });
    fixture = TestBed.createComponent(DiscountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
