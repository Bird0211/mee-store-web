import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCompleteConfirmComponent } from './order-complete-confirm.component';

describe('OrderCompleteConfirmComponent', () => {
  let component: OrderCompleteConfirmComponent;
  let fixture: ComponentFixture<OrderCompleteConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCompleteConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCompleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
