import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsAdvertisementComponent } from './comments-advertisement.component';

describe('CommentsAdvertisementComponent', () => {
  let component: CommentsAdvertisementComponent;
  let fixture: ComponentFixture<CommentsAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsAdvertisementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
