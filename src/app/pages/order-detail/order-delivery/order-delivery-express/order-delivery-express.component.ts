import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/pages/user/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/pages/error.service';
import { Result, OrderExpress } from 'src/app/pages/interface';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-order-delivery-express',
  templateUrl: './order-delivery-express.component.html',
  styleUrls: ['./order-delivery-express.component.less']
})

export class OrderDeliveryExpressComponent implements OnInit, OnChanges {

  @Input() orderId:number;

  @Input() express: OrderExpress;

  @Output() update:  EventEmitter<number> = new EventEmitter();

  @Output() changeType: EventEmitter<number> = new EventEmitter();

  addExpressUrl: string;

  editExpressUrl: string;

  loading = false;

  selecedComany: string;

  expressCode: string;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private fb: FormBuilder,
              private message: NzMessageService,
              private errorService: ErrorService) {
                this.addExpressUrl = environment.addExpressUrl;
                this.editExpressUrl = environment.editExpressUrl;
              }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.express && changes.express.currentValue) {
      this.expressCode = this.express.expressCode;
      this.selecedComany = this.express.expressName;
    }
  }

  ngOnInit(): void {

  }

  submit() {

    if(this.selecedComany === null || this.selecedComany === undefined) {
      this.message.error('请选择快递公司');
      return;
    }

    if(this.expressCode === null || this.expressCode === undefined) {
      this.message.error('请填写快递单号');
      return;
    }
    this.loading = true;

    if(this.express.id === null) { // add
      this.addExpress().subscribe((result:Result) => {
        this.loading = false;
        if(result.statusCode === 0) {
          this.update.emit(this.orderId);
        } else {
          this.errorService.error(result.statusCode);
        }
      });
    } else {                  // edit
      this.editExpress().subscribe((result:Result) => {
        this.loading = false;
        if(result.statusCode === 0) {
          this.update.emit(this.orderId);
        } else {
          this.errorService.error(result.statusCode);
        }
      });
    }
  }

  addExpress() {
    const url = this.addExpressUrl + '/' + this.orderId;
    const data = {expressCode:this.expressCode,expressCompany:this.selecedComany};
    return this.http.post(url,data);
  }

  editExpress() {
    const url = this.editExpressUrl;

    const data = {
      id: this.express.id,

      orderId: this.express.orderId,

      expressCode: this.expressCode,

      expressName: this.selecedComany,

      type: 0
    }

    return this.http.post(url,data);
  }

  changeExpressType(value: number) {
    this.changeType.emit(value);
  }

}
