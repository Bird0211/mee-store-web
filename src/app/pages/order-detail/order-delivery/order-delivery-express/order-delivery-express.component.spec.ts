import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliveryExpressComponent } from './order-delivery-express.component';

describe('OrderDeliveryExpressComponent', () => {
  let component: OrderDeliveryExpressComponent;
  let fixture: ComponentFixture<OrderDeliveryExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDeliveryExpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeliveryExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
