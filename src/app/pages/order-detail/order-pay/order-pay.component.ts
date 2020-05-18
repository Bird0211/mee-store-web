import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderStepComponent, Result, FeeVo, PayMethod, OrderPayVo, OrderPay, PayDetail } from '../../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../error.service';
import { AuthService } from '../../user/auth.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-order-pay',
  templateUrl: './order-pay.component.html',
  styleUrls: ['./order-pay.component.less']
})
export class OrderPayComponent implements OnInit,OrderStepComponent {


  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;

  orderFeeUrl: string;
  payMethodUrl: string;
  payUrl: string;

  fee: FeeVo;

  selectedPayMethod: number;

  payMethod: PayMethod[];

  loading = false;

  payMessage: string;

  reference: string;

  constructor(private http: HttpClient,
              private errorService: ErrorService,
              private authService: AuthService,
              private message: NzMessageService) {
    this.orderFeeUrl = environment.orderFeeUrl;
    this.payMethodUrl = environment.payMethodUrl;
    this.payUrl = environment.payUrl;
  }

  ngOnInit(): void {
    this.loadPayFeeData();
    this.loadPayMethod();
  }

  loadPayFeeData() {
    this.getPayFeeData().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.fee = result.data;
      } else  {
        this.errorService.error(result.statusCode);
      }
    });
  }

  getPayFeeData() {
    const url = this.orderFeeUrl + '/' + this.data;
    return this.http.get(url);
  }

  loadPayMethod() {
    this.getPayMethod().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.payMethod = result.data;
      }
    });
  }

  getPayMethod() {
    const url = this.payMethodUrl + '/' + this.authService.getBizId();
    return this.http.get(url);
  }

  submit() {
    if(this.selectedPayMethod === null || this.selectedPayMethod === undefined) {
        this.message.error('请选择支付方式');
        return;
    }

    if(this.selectedPayMethod === 0) {
      this.postPay().subscribe((result:Result) => {
        if(result.statusCode === 0) {
          this.callback.emit(this.data);
        } else {
          this.errorService.error(result.statusCode);
        }
      });
    }
  }

  postPay() {
    const url = this.payUrl + '/' + this.data;
    const orderPay: OrderPay[] = [{
      id: null,
      payCode: this.selectedPayMethod,
      payPrice: this.fee.totalFee,
      orderId: this.data,
      reference: this.reference,
      payNo: null
    }];
    const payDetails: PayDetail[] = [];
    this.fee.feeDetail.forEach((item) => payDetails.push({
        id: null,
        orderId: this.data,
        feeType: item.feeType,
        price: item.fee
    }));

    const orderPayVo: OrderPayVo = {
      orderPay,
      payDetails
    };

    return this.http.post(url,orderPayVo);
  }



  changePayMethod(method: number) {
    if(method === 0) {
      this.reference = (this.data as string).substr(0,10);
      this.payMessage = '转账时请填写reference :' + this.reference;
    }
  }
}
