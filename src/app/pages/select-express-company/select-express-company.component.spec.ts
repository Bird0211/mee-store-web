import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectExpressCompanyComponent } from './select-express-company.component';

describe('SelectExpressCompanyComponent', () => {
  let component: SelectExpressCompanyComponent;
  let fixture: ComponentFixture<SelectExpressCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectExpressCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectExpressCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
