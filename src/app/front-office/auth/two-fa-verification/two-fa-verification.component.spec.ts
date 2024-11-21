import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFaVerificationComponent } from './two-fa-verification.component';

describe('TwoFaVerificationComponent', () => {
  let component: TwoFaVerificationComponent;
  let fixture: ComponentFixture<TwoFaVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFaVerificationComponent]
    });
    fixture = TestBed.createComponent(TwoFaVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
