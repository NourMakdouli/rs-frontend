import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferFormComponent } from './job-offer-form.component';

describe('JobOfferFormComponent', () => {
  let component: JobOfferFormComponent;
  let fixture: ComponentFixture<JobOfferFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOfferFormComponent]
    });
    fixture = TestBed.createComponent(JobOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
