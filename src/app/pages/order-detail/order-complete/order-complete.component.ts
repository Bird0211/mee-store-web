import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderStepComponent } from '../../interface';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.less']
})
export class OrderCompleteComponent implements OnInit,OrderStepComponent {

  constructor() { }
  @Output() callback: EventEmitter<string> = new EventEmitter();

  @Input() data: any;

  ngOnInit(): void {
  }

  complate() {

  }

}
