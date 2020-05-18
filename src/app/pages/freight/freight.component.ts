import { Component, OnInit } from '@angular/core';
import { Freight, FeightDetail, Result, City, Suburb, FreightVo } from '../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../user/auth.service';


@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrls: ['./freight.component.less']
})
export class FreightComponent implements OnInit {

  datas: FreightVo[] = [];

  defaultId: number;

  addFreightUrl: string;

  allFreightUrl: string;

  defaultFreightUrl: string;

  visible = false;

  constructor(private http: HttpClient,
              private message: NzMessageService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.addFreightUrl = environment.addFreightUrl;
    this.allFreightUrl = environment.allFreightUrl;
    this.defaultFreightUrl = environment.setDefaultFreightUrl;
    this.loadFreight();
    this.loadDefaultFreight();
  }

  loadFreight() {
    this.getAllFreight().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.datas = result.data;
      }
    });
  }

  getAllFreight() {
    return this.http.get(this.allFreightUrl + '/' + this.authService.getBizId());
  }

  addFrieht() {
    this.visible = true;
  }

  loadDefaultFreight() {
    this.getDefaultFreight(Number(this.authService.getBizId())).subscribe((result: Result) => {
        if(result.statusCode === 0) {
          this.defaultId = result.data;
        }
    });
  }

  getDefaultFreight(bizId: number) {
    const url = this.defaultFreightUrl + '/' + bizId;
    return this.http.get(url);
  }

  setDefault(value: number) {
    this.defaultId = value;
  }

  deleteFreight(value: number){
    this.datas = this.datas.filter(item => item.freight.id !== value);
  }

  reLoadFreight() {
    this.loadFreight();
  }

  visibleChange(value: boolean){
    this.visible = value;
  }

}
