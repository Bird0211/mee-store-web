import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPayConfirmComponent } from './order-pay-confirm.component';

describe('OrderPayConfirmComponent', () => {
  let component: OrderPayConfirmComponent;
  let fixture: ComponentFixture<OrderPayConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPayConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPayConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
