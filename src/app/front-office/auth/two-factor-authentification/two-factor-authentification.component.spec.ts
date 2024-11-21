import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorAuthentificationComponent } from './two-factor-authentification.component';

describe('TwoFactorAuthentificationComponent', () => {
  let component: TwoFactorAuthentificationComponent;
  let fixture: ComponentFixture<TwoFactorAuthentificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactorAuthentificationComponent]
    });
    fixture = TestBed.createComponent(TwoFactorAuthentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
