import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponatnousJobApplicationComponent } from './sponatnous-job-application.component';

describe('SponatnousJobApplicationComponent', () => {
  let component: SponatnousJobApplicationComponent;
  let fixture: ComponentFixture<SponatnousJobApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SponatnousJobApplicationComponent]
    });
    fixture = TestBed.createComponent(SponatnousJobApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
