import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAdvertisementsComponent } from './details-user.component';

describe('DetailsAdvertisementsComponent', () => {
  let component: DetailsAdvertisementsComponent;
  let fixture: ComponentFixture<DetailsAdvertisementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsAdvertisementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAdvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
