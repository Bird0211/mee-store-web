import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderStepComponent, Result, OrderExpress } from '../../interface';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../user/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ErrorService } from '../../error.service';

@Component({
  selector: 'app-order-delivery',
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.less']
})
export class OrderDeliveryComponent implements OnInit, OrderStepComponent {

  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;


  expressUrl: string;

  express: any;

  loading = false;

  expressType = 0;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private fb: FormBuilder,
              private errorService: ErrorService) {
    this.expressUrl = environment.expressUrl;
  }

  ngOnInit(): void {
    this.loadExpress();
  }


  changeExpressType(expressType: number) {
    this.expressType = expressType;
  }

  loadExpress() {
    this.getExpress().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        const orderExpress: OrderExpress[] = result.data;
        if(orderExpress && orderExpress.length > 0) {
          if(orderExpress.filter(item => item.type === 1).length > 0)
              this.expressType = 1;
          else
              this.expressType = 0;

          if(this.expressType === 0) {
            this.express = orderExpress[0];
          } else {
            this.express = orderExpress
          }
        }
      }
    });
  }

  getExpress() {
    const url = this.expressUrl + '/' + this.data;
    return this.http.get(url);
  }

  updateExpress(value) {
    this.callback.emit(value);
  }

}
