import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubgroupComponent } from './add-subgroup.component';

describe('AddSubgroupComponent', () => {
  let component: AddSubgroupComponent;
  let fixture: ComponentFixture<AddSubgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
