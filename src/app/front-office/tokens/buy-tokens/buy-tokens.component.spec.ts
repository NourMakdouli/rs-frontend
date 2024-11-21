import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTokensComponent } from './buy-tokens.component';

describe('BuyTokensComponent', () => {
  let component: BuyTokensComponent;
  let fixture: ComponentFixture<BuyTokensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyTokensComponent]
    });
    fixture = TestBed.createComponent(BuyTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
