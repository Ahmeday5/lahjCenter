import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcurrencyComponent } from './all-CurrencyComponent.component';

describe('AllcurrencyComponent', () => {
  let component: AllcurrencyComponent;
  let fixture: ComponentFixture<AllcurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllcurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllcurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
