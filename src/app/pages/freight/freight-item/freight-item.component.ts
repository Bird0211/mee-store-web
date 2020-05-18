import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FreightVo, Result } from '../../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-freight-item',
  templateUrl: './freight-item.component.html',
  styleUrls: ['./freight-item.component.less']
})
export class FreightItemComponent implements OnInit,OnChanges {

  @Input() freightVo: FreightVo = {freight: null, freightDetail: null};

  @Input() default: number;

  @Output() defaultChange: EventEmitter<number> = new EventEmitter();

  @Output() delete: EventEmitter<number> = new EventEmitter();

  checked: boolean;

  visible = false;

  firstTitle = '首件(个)';

  firstPriceTitle = '运费';

  moreTitle = '续件(个)';

  morePriceTitle = '续费';

  freeShippingTitle = '免运费';

  setDefaultFreightUrl: string;
  removeFreightUrl: string;
  removeFreightDetailURl: string;
  getFreightUrl: string;

  constructor(private http: HttpClient,
              private message: NzMessageService) {
    this.setDefaultFreightUrl = environment.setDefaultFreightUrl;
    this.removeFreightUrl = environment.removeFreightUrl;
    this.removeFreightDetailURl = environment.removeFreightDetailURl;
    this.getFreightUrl = environment.getFreightUrl;
  }
  ngOnChanges(changes: SimpleChanges): void {
    const newDefault = changes.default.currentValue;
    this.checked = newDefault === this.freightVo.freight.id;
  }

  ngOnInit(): void {
    this.selectType(this.freightVo.freight.type);
    this.checked = this.default === this.freightVo.freight.id;
  }

  editFreight() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  visibleChange(value: boolean) {
    this.visible = value;
  }


  edit() {

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

  removeFreight() {
    this.delFreight().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.message.success('删除成功!');
        this.delete.emit(this.freightVo.freight.id);
      } else {
        this.message.error('删除失败！');
      }
    });
  }

  delFreight() {
    const url = this.removeFreightUrl + '/' + this.freightVo.freight.bizId +'/' + this.freightVo.freight.id;
    return this.http.delete(url);
  }

  removeFreightDetail(freightDetailId: number) {
    this.delFreightDetail(freightDetailId).subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.message.success('删除成功!');
        this.freightVo.freightDetail = this.freightVo.freightDetail.filter(item => item.id !== freightDetailId);
      } else {
        this.message.error('删除失败!');
      }
    });
  }

  delFreightDetail(freightDetailId: number) {
    const url = this.removeFreightDetailURl + '/' + freightDetailId;
    return this.http.delete(url);
  }

  setDefault(value: boolean) {
    if(value) {
      this.putDefult(this.freightVo.freight.bizId, this.freightVo.freight.id).subscribe((result: Result) => {
        if(result.statusCode === 0) {
          this.message.success('设置成功!');
          this.defaultChange.emit(this.freightVo.freight.id);
        }
      });
    }
  }

  putDefult(bizId: number, freightId: number) {
    const url = this.setDefaultFreightUrl +'/' + bizId + '/' + freightId;
    return this.http.put(url, null);
  }

  reLoadFreight() {
    this.loadFreight().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.freightVo = result.data;
      }
    })
  }

  loadFreight() {
    const url = this.getFreightUrl + '/' + this.freightVo.freight.id;
    return this.http.get(url);
  }
}
