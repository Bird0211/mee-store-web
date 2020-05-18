import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderStepComponent, SelectProducts, OrderDetail, OrderParamVo, Result, ProductParamVo } from '../../interface';
import { AuthService } from '../../user/auth.service';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.less']
})
export class OrderEditComponent implements OnInit, OrderStepComponent {

  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;

  selectProducts: SelectProducts[] = [];
  optionList: SelectProducts[] = [];
  selectedProduct: number;
  displayTips = true;
  orders: OrderDetail[] = [];
  order: OrderParamVo;
  allPrudoctUrl = null;
  submitOrderUrl = null;
  orderDetailUrl = null;

  totalPrice: number | 0;
  totalNum: number | 0;

  saveloading = false;
  submintloading = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private msg: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.allPrudoctUrl = environment.allProductUrl;
    this.submitOrderUrl = environment.submitOrderUrl;
    this.orderDetailUrl = environment.orderDetailUrl;

    this.loadAllProdcut();

    if (this.data > 0 ) {
      this.loadOrder();
    }
  }

  onSearch(value: string): void {
    if (value && value.length > 1) {
      const values: string[] = value.split(' ');
      let tempList: SelectProducts[] = this.selectProducts;
      for (const v of values) {
        if (v && v.length > 0) {
          tempList = tempList.filter(item => item.barcode.indexOf(v) > -1 || item.productName.indexOf(v) > -1);
        }
      }
      this.optionList = tempList;
      this.displayTips = false;
    } else {
      this.optionList = [];
      this.displayTips = true;
    }
  }

  loadAllProdcut() {
    this.getAllProduct().subscribe((result: Result) => {
      if (result.statusCode === 0) {
        const prodcuts: ProductParamVo[] = result.data;
        this.setSelectProducts(prodcuts);
      }
    });
  }

  getAllProduct() {
    const url = this.allPrudoctUrl + '/' + this.authService.getBizId();
    return this.http.get(url);
  }

  setSelectProducts(prodcuts: ProductParamVo[]) {
    for (const prodcut of prodcuts) {
      const productId = prodcut.id;
      const productName = prodcut.name;
      const productImage = prodcut.image;

      for (const spec of prodcut.specifications) {
         const specId = spec.id;
         const barcode = spec.barcode;
         const specName = spec.name;
         const price = spec.price;
         const specImage = spec.image;
         const weight = spec.weight;

         const item: SelectProducts = {
           productId,
           productName,
          image: specImage !== '' ? specImage : productImage,
          specificationId: specId,
          specificationName: specName,
          barcode,
          price,
          weight
         };
         this.selectProducts.push(item);
      }
    }
  }

  addProduct() {
    const products: SelectProducts[] = this.selectProducts.filter(item => item.specificationId === this.selectedProduct);
    if (!products || products.length <= 0) {
      this.msg.error('选择商品有误!');
      return;
    }

    if (this.orders.filter(item => item.specId === this.selectedProduct).length > 0) {
      this.orders.filter(item => item.specId === this.selectedProduct).forEach( i => {i.number++ ; i.total += i.price; });
    } else {
      const product = products[0];
      this.orders = [...this.orders, {
        productId: product.productId,
        productName: product.productName,
        specId: product.specificationId,
        specName: product.specificationName,
        image: product.image,
        number: 1,
        price: product.price,
        total: product.price,
        weight: product.weight
      }];
    }

    this.updatePrice();
  }

  cancel(): void {
  }

  confirm(value: number): void {
    this.orders = this.orders.filter(i => i.specId !== value);
    this.updatePrice();
  }

  updatePrice() {
    let tPrice = 0;
    let tNum = 0;
    this.orders.forEach(item => {tPrice += item.total; tNum += item.number; });

    this.totalPrice = tPrice;
    this.totalNum = tNum;
  }

  changeValue() {
    this.orders.filter(item => item.specId === this.selectedProduct).forEach( i => {i.total = i.price * i.number; });
    this.updatePrice();
  }

  formatterDollar = (value: number) => `$ ${value}`;
  parserDollar = (value: string) => value.replace('$ ', '');

  submitOrder() {
    this.submintloading = true;
    this.postSubmitOrder().subscribe((result: Result) => {
      if (result.statusCode === 0) {
        this.msg.success('提交成功!');
        this.callback.emit(result.data);
      } else {
        this.msg.error('提交失败！');
      }
      this.submintloading = false;
    });
  }

  postSubmitOrder() {
    const url = this.submitOrderUrl;
    const data: OrderParamVo = {
      bizId: Number(this.authService.getBizId()),
      totalPrice: this.totalPrice,
      id: this.data > 0 ? this.data : null,
      userId: this.order?this.order.userId : 0,
      status: this.order ? this.order.status : -1,
      createTime: null,
      payTime: null,
      remark: null,
      orderDetails: this.orders
    };
    return this.http.post(url, data);
  }

  loadOrder() {
    this.getOrder().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.order = result.data;
        this.orders = this.order.orderDetails;
        let num = 0;
        let tprice = 0;
        this.orders.forEach(item => {
          item.total = item.number * item.price;
          num += item.number;
          tprice += item.total;
        });
        this.totalPrice = tprice;
        this.totalNum = num;
      }
    });
  }

  getOrder() {
    const url = this.orderDetailUrl + '/' + this.data;
    return this.http.get(url);
  }
}
