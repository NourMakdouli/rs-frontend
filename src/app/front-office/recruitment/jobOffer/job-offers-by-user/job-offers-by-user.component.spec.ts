import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOffersByUserComponent } from './job-offers-by-user.component';

describe('JobOffersByUserComponent', () => {
  let component: JobOffersByUserComponent;
  let fixture: ComponentFixture<JobOffersByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOffersByUserComponent]
    });
    fixture = TestBed.createComponent(JobOffersByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
