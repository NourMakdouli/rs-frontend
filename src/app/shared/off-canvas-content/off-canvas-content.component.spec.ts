import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffCanvasContentComponent } from './off-canvas-content.component';

describe('OffCanvasContentComponent', () => {
  let component: OffCanvasContentComponent;
  let fixture: ComponentFixture<OffCanvasContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffCanvasContentComponent]
    });
    fixture = TestBed.createComponent(OffCanvasContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
