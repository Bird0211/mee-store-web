import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { OrderStepComponent, Result, OrderAddress, City } from '../../interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.less']
})
export class OrderAddressComponent implements OnInit, OrderStepComponent {

  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;

  validateForm: FormGroup;

  addressUrl: string = null;
  addAddressUrl: string;
  searchCityUrl: string;
  searchSuburbUrl: string;

  loading = false;
  isLoading = false;

  cityList: string[];
  suburbList: string[]


  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private msg: NzMessageService) { }

  ngOnInit(): void {
    this.addressUrl = environment.getAddressUrl;
    this.addAddressUrl = environment.addAddressUrl;
    this.searchCityUrl = environment.searchCityUrl;
    this.searchSuburbUrl = environment.searchSuburbUrl;

    this.validateForm = this.fb.group({
      id: [null],
      orderId: [this.data],
      firstName: [null,[Validators.required]],
      lastName: [null,[Validators.required]],
      email: [null,[Validators.required, Validators.email]],
      phone: [null],
      street: [null,[Validators.required]],
      postcode: [null,[Validators.required]],
      city: [null,[Validators.required]],
      suburb: [null,[Validators.required]]
    });


    this.loadAddress();
  }

  loadAddress() {
    this.getAddress().subscribe((result: Result) => {
      if(result.statusCode === 0 && result.data) {
        const address: OrderAddress = result.data;
        this.validateForm.patchValue(address);
        if(address.city) {
          this.cityList = [address.city];
        }

        if(address.suburb) {
          this.suburbList = [address.suburb];
        }
      }
    });
  }

  getAddress() {
    const url = this.addressUrl + '/' + this.data;
    return this.http.get(url);
  }

  submitForm(): void {
    this.loading = true;
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    const formData: OrderAddress = this.validateForm.value;
    this.postAddress(formData).subscribe((result: Result) => {
      if (result.statusCode === 0) {
        this.msg.success('添加成功！');
        this.callback.emit(this.data);
      } else {
        this.msg.error('更新失败！');
      }
      this.loading = false;
    });

  }

  postAddress(data: OrderAddress) {
    const url = this.addAddressUrl;
    return this.http.post(url,data);
  }

  cityChange(selectCity: string) {
    if(selectCity) {
      this.validateForm.patchValue({city: selectCity});
    }

  }

  suburbChange(selectSuburb: string) {
    this.validateForm.patchValue({suburb: selectSuburb});
  }

  onSearch(value: string) {
    if(value.length > 2) {
      this.isLoading = true;
      this.searchCity(value).subscribe((result: Result) => {
        this.isLoading = false;
        if(result.statusCode === 0) {
          this.cityList = result.data;
        }
      });
    }
  }

  searchCity(value: string) {
    const url = this.searchCityUrl + '/' + value;
    return this.http.get(url);
  }

  onSuburbSearch(value: string) {
    if(value && value.length > 2) {
      const formData: OrderAddress = this.validateForm.value;
      const city = formData.city;
      if(!city || city.length <= 0) {
        this.msg.error('Please fill in the City');
        return;
      }
      this.isLoading = true;
      this.searchSuburb(city,value).subscribe((result: Result) => {
        if(result.statusCode === 0) {
          this.suburbList = result.data;
        }
        this.isLoading = false;
      });
    }
  }

  searchSuburb(city: string, value: string) {
    const url = this.searchSuburbUrl + '/' + city + '/' + value;
    return this.http.get(url);
  }
}
