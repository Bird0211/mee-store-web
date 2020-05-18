import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appOrderHost]'
})
export class OrderHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
