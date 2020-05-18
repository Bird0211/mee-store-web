import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderStepComponent, Result } from '../../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../error.service';

@Component({
  selector: 'app-order-complete-confirm',
  templateUrl: './order-complete-confirm.component.html',
  styleUrls: ['./order-complete-confirm.component.less']
})
export class OrderCompleteConfirmComponent implements OnInit, OrderStepComponent {

  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;

  orderCompleteUrl:string;

  loading = false;

  constructor(private http: HttpClient,
              private errorService: ErrorService) {
      this.orderCompleteUrl = environment.orderCompleteUrl;
   }

  ngOnInit(): void {
  }

  complete() {
    this.loading = true;
     this.postOrder().subscribe((result: Result) => {
       this.loading = false;
       if(result.statusCode === 0) {
         this.callback.emit(this.data);
       } else {
          this.errorService.error(result.statusCode);
       }
     });
  }

  postOrder() {
    const url = this.orderCompleteUrl + '/' + this.data;
    return this.http.post(url,null);
  }
}
