import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Result, OrderDetail, OrderExpress, PartialDelivery, OrderExpressDetail } from 'src/app/pages/interface';
import { NzMessageService } from 'ng-zorro-antd';
import { ErrorService } from 'src/app/pages/error.service';

@Component({
  selector: 'app-order-delivery-partial',
  templateUrl: './order-delivery-partial.component.html',
  styleUrls: ['./order-delivery-partial.component.less']
})
export class OrderDeliveryPartialComponent implements OnInit {

  @Input() orderId: number;

  @Input() express: OrderExpress[];

  @Output() update:  EventEmitter<number> = new EventEmitter();

  @Output() changeType: EventEmitter<number> = new EventEmitter();

  unDeliverDataUrl: string;
  partialDeliveryUrl: string;


  orderDetail: OrderDetail[];

  previewImage: string;

  previewVisible = false;

  checked = false;
  indeterminate = false;

  setOfCheckedId = new Set<number>();

  loading = false;

  selecedComany: string;

  expressCode: string;

  constructor(private http: HttpClient,
              private message: NzMessageService,
              private errorService: ErrorService) {
    this.unDeliverDataUrl = environment.unDeliverDataUrl;
    this.partialDeliveryUrl = environment.partialDeliveryUrl;
  }

  ngOnInit(): void {
    console.log('Delivery-Partial init');
    this.loadUnDeliveryData();
  }

  loadUnDeliveryData() {
    this.getUnDeliverData().subscribe((result: Result) => {
      if(result.statusCode === 0) {
          this.orderDetail = result.data;
      }
    });
  }

  getUnDeliverData() {
     const url = this.unDeliverDataUrl + '/' + this.orderId;
     return this.http.get(url);
  }

  showImg(img: string) {
    this.previewImage = img;
    this.previewVisible = true;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.orderDetail.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.orderDetail.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.orderDetail.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  submit(value) {
    if(this.selecedComany === null || this.selecedComany === undefined) {
      this.message.error('请选择快递公司');
      return;
    }

    if(this.expressCode === null || this.expressCode === undefined) {
      this.message.error('请填写快递单号');
      return;
    }

    if(this.setOfCheckedId.size <= 0) {
      this.message.error('请选择商品');
      return;
    }

    this.loading = true;
    const odetail: OrderDetail[] = this.orderDetail.filter(item => this.setOfCheckedId.has(item.id));

    const express: OrderExpress = {
      id: null,
      orderId: this.orderId,
      expressCode: this.expressCode,
      expressName: this.selecedComany,
      /**
       * 0：全部发货；1:拆单
       */
      type: 1
    };

    const expressDetails: OrderExpressDetail[] = [];

    odetail.forEach(item => expressDetails.push({
        id:null,
        expressId: null,
        orderDetail: item.id,
        number: item.number
    }));

    const data: PartialDelivery  = {
      express,
      expressDetails
    };

    this.postDelivery(data).subscribe((result: Result) => {
      this.loading = false;
      if(result.statusCode === 0) {
          this.update.emit(this.orderId);
      } else {
          this.errorService.error(result.statusCode);
      }
    });
  }

  postDelivery(data: PartialDelivery) {
    const url = this.partialDeliveryUrl;
    return this.http.post(url,data);
  }

}
