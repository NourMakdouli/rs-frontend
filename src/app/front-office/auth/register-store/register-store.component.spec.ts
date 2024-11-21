import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStoreComponent } from './register-store.component';

describe('RegisterStoreComponent', () => {
  let component: RegisterStoreComponent;
  let fixture: ComponentFixture<RegisterStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterStoreComponent]
    });
    fixture = TestBed.createComponent(RegisterStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
