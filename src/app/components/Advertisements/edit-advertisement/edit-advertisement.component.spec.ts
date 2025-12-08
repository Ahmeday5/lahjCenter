import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdvertisementComponent } from './edit-advertisement.component';

describe('EditAdvertisementComponent', () => {
  let component: EditAdvertisementComponent;
  let fixture: ComponentFixture<EditAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdvertisementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
