import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { Freight, Result } from '../interface';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '../user/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-freight',
  templateUrl: './select-freight.component.html',
  styleUrls: ['./select-freight.component.less']
})
export class SelectFreightComponent implements OnInit, OnChanges {

  @Input() selectedFreight: number;

  @Output() selectedFreightChange:  EventEmitter<number> = new EventEmitter();

  freight: Freight[] = [{id: 0, name: '默认', type: null, bizId : null}];

  freightUrl = null;

  loading = false;

  constructor(private message: NzMessageService,
              private authService: AuthService,
              private http: HttpClient) {
                this.freightUrl = environment.freightUrl;
              }
  ngOnChanges(changes: SimpleChanges): void {
    const selectedFreight: number = changes.selectedFreight.currentValue;
    if(selectedFreight === undefined) {
      this.selectedFreight = 0;
      setTimeout(() => {
        this.changeFreight(0);
      });
    } else if(selectedFreight !== 0) {
        this.loadFreight();
    }

    console.log(this.selectedFreight);
    console.log(this.freight);
  }

  ngOnInit(): void {

  }

  loadFreight() {
    if(!this.freight || this.freight.length <= 1) {
      this.loading = true;
      this.getAllFreight().subscribe((result: Result) => {
        if (result.statusCode === 0) {
          this.loading = false;
          this.freight.push(...result.data);
        }
      });
    }
  }

  getAllFreight() {
    const url = this.freightUrl + '/' + this.authService.getBizId();
    return this.http.get(url);
  }

  changeFreight(value: number) {
    this.selectedFreightChange.emit(value);
  }

}
