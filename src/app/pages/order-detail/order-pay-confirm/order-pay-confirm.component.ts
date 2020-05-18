import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderPayVo, Result } from '../../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../error.service';

@Component({
  selector: 'app-order-pay-confirm',
  templateUrl: './order-pay-confirm.component.html',
  styleUrls: ['./order-pay-confirm.component.less']
})
export class OrderPayConfirmComponent implements OnInit {

  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;

  orderPayVo: OrderPayVo;

  totalFee: number;

  payConfirmUrl: string;
  payInfoUrl: string

  loading = false;

  constructor(private http: HttpClient,
              private errorService: ErrorService) {
    this.payConfirmUrl = environment.payConfirmUrl;
    this.payInfoUrl = environment.payInfoUrl;
  }

  ngOnInit(): void {
      this.loadPayInfo();
  }

  loadPayInfo() {
    this.getPayInfo().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.orderPayVo = result.data;
        console.log(this.orderPayVo);
      }
    });
  }

  getPayInfo() {
    const url = this.payInfoUrl + '/' + this.data;
    return this.http.get(url);
  }

  submit() {
    this.loading = true;
    this.postConfirm().subscribe((result: Result) => {
      this.loading = false;
      if(result.statusCode === 0) {
        this.callback.emit(this.data);
      } else {
        this.errorService.error(result.statusCode);
      }
    });
  }

  postConfirm() {
    const url = this.payConfirmUrl + '/' + this.data;
    return this.http.post(url,null);
  }

}
