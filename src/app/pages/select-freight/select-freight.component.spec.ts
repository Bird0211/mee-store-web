import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFreightComponent } from './select-freight.component';

describe('SelectFreightComponent', () => {
  let component: SelectFreightComponent;
  let fixture: ComponentFixture<SelectFreightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFreightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFreightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
