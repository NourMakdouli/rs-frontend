import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinsListComponent } from './payins-list.component';

describe('PayinsListComponent', () => {
  let component: PayinsListComponent;
  let fixture: ComponentFixture<PayinsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayinsListComponent]
    });
    fixture = TestBed.createComponent(PayinsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
