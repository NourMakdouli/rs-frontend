import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorSettingsComponent } from './two-factor-settings.component';

describe('TwoFactorSettingsComponent', () => {
  let component: TwoFactorSettingsComponent;
  let fixture: ComponentFixture<TwoFactorSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactorSettingsComponent]
    });
    fixture = TestBed.createComponent(TwoFactorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
