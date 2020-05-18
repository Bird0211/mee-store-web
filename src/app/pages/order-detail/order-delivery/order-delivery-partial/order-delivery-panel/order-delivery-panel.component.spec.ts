import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliveryPanelComponent } from './order-delivery-panel.component';

describe('OrderDeliveryPanelComponent', () => {
  let component: OrderDeliveryPanelComponent;
  let fixture: ComponentFixture<OrderDeliveryPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDeliveryPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeliveryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
