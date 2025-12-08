import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdvertisementComponent } from './all-advertisement.component';

describe('AllAdvertisementComponent', () => {
  let component: AllAdvertisementComponent;
  let fixture: ComponentFixture<AllAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllAdvertisementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
