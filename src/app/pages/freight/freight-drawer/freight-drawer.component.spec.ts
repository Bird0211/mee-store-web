import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightDrawerComponent } from './freight-drawer.component';

describe('FreightDrawerComponent', () => {
  let component: FreightDrawerComponent;
  let fixture: ComponentFixture<FreightDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
