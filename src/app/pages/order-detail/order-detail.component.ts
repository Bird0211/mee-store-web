import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild, Type } from '@angular/core';
import { StepInfo, Result, Order, OrderStepComponent } from '../interface';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { OrderHostDirective } from './order-host.directive';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderAddressComponent } from './order-address/order-address.component';
import { OrderPayComponent } from './order-pay/order-pay.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { OrderDeliveryComponent } from './order-delivery/order-delivery.component';
import { OrderCancelComponent } from './order-cancel/order-cancel.component';
import { OrderPayConfirmComponent } from './order-pay-confirm/order-pay-confirm.component';
import { OrderCompleteConfirmComponent } from './order-complete-confirm/order-complete-confirm.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.less']
})
export class OrderDetailComponent implements OnInit {
  index = 0;

  isSpinning = true;

  orderStepComponse: Type<any>[] = [];

  @ViewChild(OrderHostDirective, {static: true}) orderHost: OrderHostDirective;

  step: StepInfo[] = [{
    title: '创建',
    subTitle: '',
    description: '',
    status: '',
    disabled: false,
    isShow: true
  }, {
    title: '地址',
    subTitle: '',
    description: '填写收货信息',
    status: '',
    disabled: true,
    isShow: true
  }, {
    title: '支付',
    subTitle: '',
    description: '填写支付信息',
    status: '',
    disabled: true,
    isShow: true
  }, {
    title: '支付确认',
    subTitle: '',
    description: '确认支付完成',
    status: '',
    disabled: true,
    isShow: false
  }, {
    title: '发货',
    subTitle: '',
    description: '填写物流信息',
    status: '',
    disabled: true,
    isShow: true
  }, {
    title: ' 确认收货',
    subTitle: '',
    description: '物流已完成',
    status: '',
    disabled: true,
    isShow: false
  },{
    title: '完成',
    subTitle: '',
    description: '订单交易完成',
    status: '',
    disabled: true,
    isShow: true
  }, {
    title: '取消',
    subTitle: '',
    description: '订单被取消',
    status: '',
    disabled: true,
    isShow: false
  }];

  orderId: string;

  queryOrderUrl: string;

  onIndexChange(event: number): void {
    this.index = event;
    this.loadComponent();
  }

  constructor(private router: Router,
              private activedRoute: ActivatedRoute,
              private http: HttpClient,
              private componentFactoryResolver: ComponentFactoryResolver
              ) { }

  ngOnInit() {
    this.initComponse();
    this.queryOrderUrl = environment.queryOrderUrl;
    this.orderId = this.activedRoute.snapshot.paramMap.get('orderId');
    this.loadOrder();
  }

  initComponse() {
    this.orderStepComponse = [
      OrderEditComponent,
      OrderAddressComponent,
      OrderPayComponent,
      OrderPayConfirmComponent,
      OrderDeliveryComponent,
      OrderCompleteConfirmComponent,
      OrderCompleteComponent,
      OrderCancelComponent
    ];
  }

  loadOrder() {
    this.isSpinning = true;
    if(this.orderId ==='0') {
      this.index = 0;
      this.setIndex();
      this.loadComponent();
      this.isSpinning = false;
    } else {
      this.getOrder().subscribe((result: Result) => {
        this.isSpinning = false;
        if (result.statusCode === 0) {
          const order: Order = result.data;
          if (order.createTime) {
            this.step[0].description = formatDate(order.createTime, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
          }

          if (order.payTime) {
            this.step[2].description = formatDate(order.payTime, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
          }

          const status = order.status;
          switch (status) {
            case 1001:
              this.index = 0;
              break;

            case 1002:
              this.index = 1;
              break;

            case 1003:    // 待支付
            this.index = 2;
            break;

            case 2003 :   // 已支付，待确认
              this.index = 3;
              this.step[this.index].isShow = true;
              break;

            case 2001: // 已支付，待发货
              this.index = 4;
              break;

            case 2002:  // 已支付，部分发货
              this.index = 4;
              break;
            case 3001:        // 已发货
              this.index = 5;
              this.step[this.index].isShow = true;
              this.step[6].isShow = false;
              break;
            case 0:       // 已完成
              this.index = 6;
              break;
            case 4001:
                this.index = 7;
                this.step[this.index].isShow = true;
                this.step[6].isShow = false;
                break;
          }
          this.setIndex();
          this.loadComponent();
        }
      });
    }
  }

  getOrder() {
    const url = this.queryOrderUrl + '/' + this.orderId;
    return this.http.get(url);
  }

  setIndex() {
    this.step.forEach((item, i) => {
      if (i < this.index) {
        item.status = 'finish';
        item.disabled = false;
      } else if (i === this.index) {
        item.status = 'process';
        item.disabled = false;
      } else {
        item.status = 'wait';
        item.disabled = true;
      }
    });
  }

  loadComponent() {
    console.log('Index ',this.index);
    const orderItem = this.orderStepComponse[this.index];

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(orderItem);

    const viewContainerRef = this.orderHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as OrderStepComponent).data = this.orderId;

    if((componentRef.instance as OrderStepComponent).callback) {
      (componentRef.instance as OrderStepComponent).callback.subscribe((value: string) => {
        this.orderId = value;
        this.loadOrder();
      });
    }
  }



}
