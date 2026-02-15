import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSubgroupsComponent } from './all-subgroups.component';

describe('AllSubgroupsComponent', () => {
  let component: AllSubgroupsComponent;
  let fixture: ComponentFixture<AllSubgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSubgroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSubgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
