import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliveryPartialComponent } from './order-delivery-partial.component';

describe('OrderDeliveryPartialComponent', () => {
  let component: OrderDeliveryPartialComponent;
  let fixture: ComponentFixture<OrderDeliveryPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDeliveryPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeliveryPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
