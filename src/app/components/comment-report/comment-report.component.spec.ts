import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReportComponent } from './comment-report.component';

describe('CommentReportComponent', () => {
  let component: CommentReportComponent;
  let fixture: ComponentFixture<CommentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
