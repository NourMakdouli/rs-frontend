import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesByUserComponent } from './articles-by-user.component';

describe('ArticlesByUserComponent', () => {
  let component: ArticlesByUserComponent;
  let fixture: ComponentFixture<ArticlesByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticlesByUserComponent]
    });
    fixture = TestBed.createComponent(ArticlesByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
