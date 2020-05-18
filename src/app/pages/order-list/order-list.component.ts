import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { OrderQuery, Result, OrderParamVo, OrderList } from '../interface';
import { environment } from 'src/environments/environment';
import { AuthService } from '../user/auth.service';
import { OrderHostDirective } from '../order-detail/order-host.directive';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less']
})
export class OrderListComponent implements OnInit {

  dateRange = [];
  orders: OrderParamVo[];

  dateType = '0';

  status = '2001';

  barcode: string;

  searchUrl: string;
  orderDetailUrl: string;

  previewImage: string | undefined = '';
  previewVisible = false;

  pageIndex = 1;
  pageSize = 20;
  total: number;

  loading = false;

  constructor(private http: HttpClient,
              private msg: NzMessageService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.searchUrl = environment.searchOrderUrl;
    this.orderDetailUrl = environment.orderDetailUrl;
  }


  search() {
    if (this.barcode) {
      this.searchSku();
    } else {
      this.searchName();
    }
  }

  searchName() {
    if (this.dateRange.length <= 0) {
      this.msg.error('请选择订单时间');
      return;
    }

    const data: OrderQuery = {
      startCreateDate: this.dateType === '0' ? this.dateRange[0] : null,
      endCreateDate: this.dateType === '0' ? this.dateRange[1] : null,
      startPayDate: this.dateType === '1' ? this.dateRange[0] : null,
      endPayDate: this.dateType === '1' ? this.dateRange[1] : null,
      orderSatus: status !== null && status ? Number(this.status) : null,
      userId: null,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      bizId: Number(this.authService.getBizId()),
    }

    this.loading = true;
    this.postSearch(data).subscribe((result: Result) => {
      this.loading = false;
      if (result.statusCode === 0) {
        console.log(result.data);
        const orderlist: OrderList = result.data;
        this.orders = orderlist.orders;
        this.total = orderlist.total;
      }
    });
  }

  postSearch(data: OrderQuery) {
    return this.http.post(this.searchUrl, data);
  }

  searchSku() {
    if (!this.barcode) {
      this.msg.error('请填写订单编码');
      return;
    }

    this.loading = true;
    this.getOrderBarcode(this.barcode).subscribe((result: Result) => {
      this.loading = false;
        if (result.statusCode === 0) {
          this.orders = [result.data];
        }
    });

  }

  getOrderBarcode(orderId: string) {
    const url = this.orderDetailUrl + '/' + orderId;
    return this.http.get(url);
  }

  showImg(img: string) {
    this.previewImage = img;
    this.previewVisible = true;
  }

  detail(id: number) {
    this.router.navigate(['welcome/order',id]);
  }

  changePageIndex(value: number) {
    this.pageIndex = value;
    this.search();
  }

}
