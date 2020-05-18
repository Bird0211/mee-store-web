import { Component, OnInit, Input } from '@angular/core';
import { OrderExpress, OrderDetail, Result } from 'src/app/pages/interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-delivery-panel',
  templateUrl: './order-delivery-panel.component.html',
  styleUrls: ['./order-delivery-panel.component.less']
})
export class OrderDeliveryPanelComponent implements OnInit {

  @Input() express: OrderExpress;

  orderDetail: OrderDetail[];

  previewImage: string;

  previewVisible = false;

  expressDetailUrl: string;

  constructor(private http: HttpClient) {
      this.expressDetailUrl = environment.expressDetailUrl;
   }

  ngOnInit(): void {
  }

  loadOrderDetail() {
    this.getOrderDetail().subscribe((result: Result) => {
      this.orderDetail = result.data;
    });
  }

  getOrderDetail() {
    const url = this.expressDetailUrl + '/' + this.express.id;
    return this.http.get(url);
  }

  activeChange(value: boolean) {
    if(value && !this.orderDetail) {
       this.loadOrderDetail();
    }
  }

  showImg(img: string) {
    this.previewImage = img;
    this.previewVisible = true;
  }
}
