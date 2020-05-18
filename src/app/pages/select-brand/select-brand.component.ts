import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Brands, Result } from '../interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../user/auth.service';
import { NzMessageService, isTooltipEmpty } from 'ng-zorro-antd';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.less']
})
export class SelectBrandComponent implements OnInit {

  @Input() selectedBrand: number;

  @Output() brandChange: EventEmitter<Brands> = new EventEmitter();

  @Output() selectedBrandChange: EventEmitter<number> = new EventEmitter();

  brands: Brands[];

  newBrandName: string;

  brandlistUrl = null;

  addBrandUrl = null;

  isShowBrand = false;

  isLoading = false;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private message: NzMessageService) {
    this.brandlistUrl = environment.queryBrandUrl;
    this.addBrandUrl = environment.addBrandUrl;
  }

  ngOnInit(): void {
    if(!this.brands || this.brands.length <= 0) {
      this.initBrands();
    }
  }

  getBrandName(brandId: number): string {
    for (const brand of this.brands) {
      if (brand.id === brandId) {
        return brand.brandName;
      }
    }
  }

  initBrands() {
    this.isLoading = true;
    this.loadBrand().subscribe((result: Result) => {
      this.isLoading = false;
      if (result.statusCode === 0) {
        this.brands = result.data;
        this.isLoading = false;
      }
    });
  }

  loadBrand() {
    return this.http.get(this.brandlistUrl + '/' + this.authService.getBizId());
  }

  openBrand(isOpen: boolean) {
    if (!isOpen) {
      this.isShowBrand = false;
    } else {
      if(!this.brands || this.brands.length <= 0) {
        this.initBrands();
      }
    }
  }

  addBrandItem() {
    this.isShowBrand = true;
  }

  addBrand() {
    if (!this.newBrandName || this.newBrandName == null) {
      this.message.error('请输入品牌名称');
      return;
    }

    this.addBrandData(this.newBrandName).subscribe((result: Result) => {
      if (result.statusCode === 0) {
        const brand: Brands = result.data;
        if (brand == null) {
           this.message.error('添加失败！');
        } else {
          this.brands.push(brand);
          this.isShowBrand = false;
        }
      } else {
        this.message.error('添加失败！');
      }
    });

  }

  addBrandData(brandName: string) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    };

    const body = 'brandname=' + brandName;
    return this.http.post(this.addBrandUrl + '/' + this.authService.getBizId(), body, httpOptions);
  }

  changeBrand(value: number) {
    const brand = this.brands.filter(item => item.id === value)[0];
    this.brandChange.emit(brand);
    this.selectedBrandChange.emit(value);
  }

}
