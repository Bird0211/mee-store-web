import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightItemComponent } from './freight-item.component';

describe('FreightItemComponent', () => {
  let component: FreightItemComponent;
  let fixture: ComponentFixture<FreightItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
