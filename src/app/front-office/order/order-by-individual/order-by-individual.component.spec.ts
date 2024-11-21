import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderByIndividualComponent } from './order-by-individual.component';

describe('OrderByIndividualComponent', () => {
  let component: OrderByIndividualComponent;
  let fixture: ComponentFixture<OrderByIndividualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderByIndividualComponent]
    });
    fixture = TestBed.createComponent(OrderByIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
