import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderStepComponent } from '../../interface';

@Component({
  selector: 'app-order-cancel',
  templateUrl: './order-cancel.component.html',
  styleUrls: ['./order-cancel.component.less']
})
export class OrderCancelComponent implements OnInit, OrderStepComponent {

  constructor() { }
  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;

  ngOnInit(): void {
  }

}
