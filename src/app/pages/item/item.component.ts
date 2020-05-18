import { Component, OnInit, EventEmitter } from '@angular/core';
import { Result, ProductParam, ProductList, ProductVo, Specification, Freight } from '../interface';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less']
})
export class ItemComponent implements OnInit {
  name: string;

  specificationData: Specification[] = [];

  listOfData: ProductVo[] = [];

  selecteditProduct: ProductVo;

  editProdcutId: number;

  expandId: number;

  pageIndex = 1;
  pageSize = 20;
  total = 1;

  loading = true;
  spcloading = false;
  searchLoading = false;
  loadingSpec = true;
  isVisible = false;
  isEditVisible = false;
  isSpecVisible = false;

  previewImage: string | undefined = '';
  previewVisible = false;

  isSpinning = false;

  searchProductUrl = null;
  queryProductUrl = null;

  querySpecificationUrl = null;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private authService: AuthService,
              private message: NzMessageService
    ) {

      this.searchProductUrl = environment.searchProductUrl;
      this.queryProductUrl = environment.queryProductUrl;

      this.querySpecificationUrl = environment.querySpecificationUrl;
    }

  ngOnInit(): void {
    this.loadProductData();
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.searchLoading = true;
    this.loadData().subscribe((result: Result) => {
      if (result.statusCode === 0) {
        const data: ProductList = result.data;
        this.pageIndex = data.pageNo;
        this.pageSize = data.pageRows;
        this.total = data.total;
        this.listOfData = data.products;
      } else {
          this.message.error('查询失败,请稍后再试!');
      }
      this.searchLoading = false;
    });
  }

  loadProductData() {
    this.postProduct().subscribe((result: Result) => {
      this.loading = false;
      if (result.statusCode === 0) {
        const data: ProductList = result.data;
        this.pageIndex = data.pageNo;
        this.pageSize = data.pageRows;
        this.total = data.total;
        this.listOfData = data.products;
      }
    });
  }

  postProduct() {
    const param: ProductParam = {
      pageNo : this.pageIndex,
      pageRows : this.pageSize
    };

    return this.http.post(this.queryProductUrl + '/' + this.authService.getBizId(), param);
  }

  loadData() {
    const param: ProductParam = {
      key : this.name,
      pageNo : this.pageIndex,
      pageRows : this.pageSize
    };

    return this.http.post(this.searchProductUrl + '/' + this.authService.getBizId(), param);
  }

  addProduct() {
    this.isVisible = true;
  }

  showImg(img: string) {
    this.previewImage = img;
    this.previewVisible = true;
  }

  expandChange(event:boolean, id: number) {
    this.specificationData = [];
    if (event) {
      this.expandId = id;
      this.loadingSpecData(id).then((data: Specification[]) => {
        this.specificationData = data;
      });
    } else {
      this.expandId = null;
    }
  }

  loadingSpecData(productId: number) {
    const p = new Promise((resolve, reject) => {
      this.getSpecData(productId).subscribe((result: Result) => {
        this.loadingSpec = false;
        if (result.statusCode === 0) {
          resolve(result.data);
        } else {
          reject(false);
        }
      });
    });

    return p;
  }

  getSpecData(productId: number) {
    const url = this.querySpecificationUrl + '/' + productId;
    return this.http.get(url);
  }

  addItem(value: ProductVo) {
    this.listOfData = [...this.listOfData,value];
  }

  editItem(value: ProductVo) {
    this.listOfData.filter((item) => item.id === value.id).forEach( item =>
      {item.brandId = value.bizId,
        item.brandName = value.brandName,
        item.categoryId = value.categoryId,
        item.categoryName = value.categoryName,
        item.description = value.description,
        item.freightId = value.freightId,
        item.image = value.image,
        item.name = value.name,
        item.status = value.status
      });
  }

  editProduct(data: ProductVo) {
    this.selecteditProduct = data;
    this.isEditVisible = true;
  }

  editSpec(value: number) {
    this.editProdcutId = value;
    this.isSpecVisible = true;
  }
}
