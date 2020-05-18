import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Freight, FeightDetail, City, Suburb, Result } from '../../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-freight-drawer',
  templateUrl: './freight-drawer.component.html',
  styleUrls: ['./freight-drawer.component.less']
})
export class FreightDrawerComponent implements OnInit {

  @Input() visible = false;

  @Input() title: string;

  @Input() freight: Freight = {id: null, bizId: 0, name: null,type: 0};

  @Input() freightDetails: FeightDetail[] = [];

  @Output() loadFeight: EventEmitter<void> = new EventEmitter();

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();


  allCity: City = {id: 0, city: 'All City', checked: true};

  cities: City[] = [];

  suburbs: Suburb[]  = [];

  firstTitle = '首件(个)';

  firstPriceTitle = '运费';

  moreTitle = '续件(个)';

  morePriceTitle = '续费';

  freeShippingTitle = '免运费';

  allCitiesUrl: string;

  addFreightUrl: string;

  editFreightUrl: string;

  isShowCitys = false;

  isOkLoading = false;

  loadingCity = true;

  isSpinning = true;

  saveLoading = false;

  checkedCity = new Set<number>();

  tid = 0;

  activeRow: string;

  constructor(private http: HttpClient,
              private message: NzMessageService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.allCitiesUrl = environment.allCitiesUrl;
    this.addFreightUrl = environment.addFreightUrl;
    this.editFreightUrl = environment.editFreightUrl;

    if(!this.freightDetails || this.freightDetails.length <= 0)
      this.addRow();
    else {
      this.freightDetails.forEach(item => item.tid = `${item.id}`);
    }
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  selectType(value: number) {
    if(value === 0) {
      this.firstTitle = '首件(个)';

      this.firstPriceTitle = '运费';

      this.moreTitle = '续件(个)';

      this.morePriceTitle = '续费';

      this.freeShippingTitle = '免运费';
    } else {
      this.firstTitle = '首重(g)';

      this.firstPriceTitle = '运费';

      this.moreTitle = '续重(g)';

      this.morePriceTitle = '续费';

      this.freeShippingTitle = '免运费';
    }
  }

  showCitys(data: FeightDetail) {
    this.loadAllCities();
    this.activeRow = data.tid;

    const citys = data.citys;
    this.suburbs = [];

    if(citys === '') {
      this.suburbs = [];
      this.cities.forEach(item => item.checked = true);
      this.allCity.checked = true;
    } else {
      this.allCity.checked = false;
      console.log(citys);
      const selectedCitys: string[] = citys.split(';');
      console.log(selectedCitys);
      const checkedCity:string[] = [];
      const suburbs: string[] = [];
      const allSuburbCity: string[] = [];
      selectedCitys.forEach(item => {
        if(item !== '' && item.length > 0) {
          const city = item.substring(0,item.indexOf('['));
          const suburb = item.substring(item.indexOf('[')+1,item.indexOf(']'));
          checkedCity.push(city);
          if(suburb === 'ALL') {
              allSuburbCity.push(city);
          } else {
            suburbs.push(...suburb.split(','));
          }
        }
      });


      this.cities.filter(i => checkedCity.indexOf(i.city) >= 0).forEach(i => i.checked = true);
      if(allSuburbCity.length > 0) {
        this.cities.filter(i => allSuburbCity.indexOf(i.city) >= 0).map(i => i.suburb).forEach(i => suburbs.push(...i.split(',')))
        console.log(suburbs);
      }

      const allSuburb:string[] = this.cities.filter(i => i.checked === true).map(i => i.suburb);
      allSuburb.forEach(i => {
        if(i !== '') {
          i.split(',').forEach(
            item => this.suburbs.push(this.newSuburt(item, suburbs.indexOf(item) >= 0))
          );
        }
      });
    }
    this.isShowCitys = true;
  }

  loadAllCities() {
    if(!this.cities || this.cities.length <= 0) {
      this.getAllCities().subscribe((result : Result) => {
        if(result.statusCode === 0) {
          this.cities = [...result.data];
          this.cities.forEach(item => item.checked = true);
          this.loadingCity = false;
          this.isSpinning = false;
        }
      });
    } else
      this.isSpinning = false;
  }

  addRow(): void {
    const freightId = this.freight.id;

    this.freightDetails = [
      ...this.freightDetails,
      {
        id: null,
        citys: '',
        first: 1,
        firstPrice: 0,
        more: 1,
        morePrice: 0,
        freeShipping: null,
        freeType: 0,
        freightId,
        tid: `${this.tid}`
      }
    ];

    this.tid++;
  }


  removeRow(tid: string):void {
    this.freightDetails = this.freightDetails.filter(item => item.tid !== tid);
  }

  save() {
    if(!this.freight.name || this.freight.name === '') {
      this.message.error('请输入模板名称');
      return;
    }

    if(this.freightDetails.length <= 0) {
      this.message.error('请添加配送区域及运费！');
      return;
    }

    if(this.freightDetails.filter(item => item.citys === '').length > 0) {
      this.message.error('请点击选择配送区域!');
      return;
    }

    // 更新
    if(this.freight && this.freight.id && this.freight.id > 0) {
      this.editFreight();
    } else {  // 新建
      this.addFreight();
    }
  }

  addFreight(){
    const freight: Freight = {
      id: null,
      bizId: Number(this.authService.getBizId()),
      name: this.freight.name,
      type: this.freight.type
    };

    this.saveLoading = true;
    this.postSaveFreight(freight).subscribe((result: Result) => {
      this.saveLoading = false;
      if(result.statusCode === 0) {
        this.message.success('添加成功!');
        this.loadFeight.emit();
        this.visible = false;
      } else {
        this.message.error('添加失败!');
      }
    });
  }

  editFreight() {
    console.log('EditFreight');
    this.saveLoading = true;

    this.postEditFreight().subscribe((result: Result) => {
      this.saveLoading = false;
      if(result.statusCode === 0) {
        this.message.success('更新成功!');
        this.loadFeight.emit();
        this.visible = false;
      } else {
        this.message.error('更新失败!');
      }
    });

  }

  postEditFreight() {
    return this.http.post(this.editFreightUrl,{freight: this.freight,freightDetail:this.freightDetails});
  }

  handleCancel() {
    this.isShowCitys = false;
  }

  handleOk() {
    let chooseArea = '';
    if(this.allCity.checked) {
      chooseArea = this.allCity.city;
    } else {
      const selectCity: City[] = this.cities.filter(item => item.checked === true);
      if(!selectCity || selectCity.length <= 0) {
        this.message.error('请选择城市!');
        return;
      }

      selectCity.forEach(item => {
        const city = item.city;
        const suburb = this.selectedSuburb(item.suburb);
        chooseArea += city+' ['+suburb+']; ';
      });
    }

    this.freightDetails.filter(item => item.tid === this.activeRow).forEach(item => item.citys = chooseArea);
    this.isShowCitys = false;
  }

  getAllCities() {
    return this.http.get(this.allCitiesUrl);
  }

  onCityChecked(city: City) {
    if(city.checked) {
      if(this.cities.filter(item => item.checked === false).length <= 0) {
        this.allCity.checked = true;
        this.suburbs = [];
      } else {
        const suburb = city.suburb;
        if(suburb) {
          this.addSuburb(suburb);
        }
      }
    } else {
      if(this.allCity.checked) {
        this.allCity.checked = false;
        const suburb: string[] = this.cities.filter(item => item.checked === true).map(item => item.suburb);
        suburb.forEach(item => {
          this.addSuburb(item);
        })
      } else {
        this.removeSuburb(city.suburb);
      }

    }
  }

  onAllCityChecked(checked : boolean) {
    if(checked) {
      this.cities.forEach(item => item.checked = true);
      this.suburbs = [];
    } else {
      this.cities.forEach(item => item.checked = false);
    }
  }

  addSuburb(suburb: string) {
    if(suburb) {
      const subs: Suburb[] = suburb.split(',').map(item => this.newSuburt(item, true));
      this.suburbs = [...this.suburbs,...subs];
    }
  }

  removeSuburb(suburb: string) {
    if(suburb) {
      const subs: string[] = suburb.split(',');
      this.suburbs = this.suburbs.filter(item => subs.indexOf(item.suburb) < 0);
    }
  }

  newSuburt(suburb: string, checked: boolean): Suburb {
    const sub: Suburb = {suburb, checked};
    return sub;
  }

  selectedSuburb(suburb: string): string {
    let result = 'ALL';
    if(suburb) {
      const subs: string[] = suburb.split(',');
      const selectSub: Suburb[] = this.suburbs.filter(item => item.checked === true && subs.indexOf(item.suburb) >= 0);
      if(subs.length !== selectSub.length) {
        result = selectSub.map(item => item.suburb).join(',');
      }
    }

    return result;
  }

  changeFreeType(value: number) {
    if(value === 0) {
      this.freightDetails.filter(item => item.freeType === 0).forEach(item => item.freeShipping = null);
    }
  }

  postSaveFreight(freight: Freight) {
    return this.http.post(this.addFreightUrl,{freight, freightDetail: this.freightDetails});
  }


}
