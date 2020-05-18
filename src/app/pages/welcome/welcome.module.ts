import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { MenuComponent } from '../menu/menu.component';
import { ItemComponent } from '../item/item.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../user/user.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderListComponent } from '../order-list/order-list.component';
import { OrderEditComponent } from '../order-detail/order-edit/order-edit.component';
import { OrderAddressComponent } from '../order-detail/order-address/order-address.component';
import { OrderPayComponent } from '../order-detail/order-pay/order-pay.component';
import { OrderDeliveryComponent } from '../order-detail/order-delivery/order-delivery.component';
import { OrderCompleteComponent } from '../order-detail/order-complete/order-complete.component';
import { OrderCancelComponent } from '../order-detail/order-cancel/order-cancel.component';
import { OrderHostDirective } from '../order-detail/order-host.directive';
import { FreightComponent } from '../freight/freight.component';
import { FreightItemComponent } from '../freight/freight-item/freight-item.component';
import { FreightDrawerComponent } from '../freight/freight-drawer/freight-drawer.component';
import { ItemAddComponent } from '../item/item-add/item-add.component';
import { ItemEditComponent } from '../item/item-edit/item-edit.component';
import { ItemDetailEditComponent } from '../item/item-detail-edit/item-detail-edit.component';
import { SelectBrandComponent } from '../select-brand/select-brand.component';
import { SelectCategoryComponent } from '../select-category/select-category.component';
import { SelectFreightComponent } from '../select-freight/select-freight.component';
import { OrderPayConfirmComponent } from '../order-detail/order-pay-confirm/order-pay-confirm.component';
import { OrderDeliveryExpressComponent } from '../order-detail/order-delivery/order-delivery-express/order-delivery-express.component';
import { OrderDeliveryPartialComponent } from '../order-detail/order-delivery/order-delivery-partial/order-delivery-partial.component';
import { SelectExpressCompanyComponent } from '../select-express-company/select-express-company.component';
import { OrderDeliveryPanelComponent } from '../order-detail/order-delivery/order-delivery-partial/order-delivery-panel/order-delivery-panel.component';
import { OrderCompleteConfirmComponent } from '../order-detail/order-complete-confirm/order-complete-confirm.component';


@NgModule({
  imports: [
    WelcomeRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  declarations: [WelcomeComponent,
                MenuComponent,
                ItemComponent,
                UserComponent,
                OrderDetailComponent,
                OrderListComponent,
                OrderHostDirective,
                OrderEditComponent,
                OrderAddressComponent,
                OrderPayComponent,
                OrderPayConfirmComponent,
                OrderDeliveryComponent,
                OrderDeliveryExpressComponent,
                OrderDeliveryPartialComponent,
                OrderDeliveryPanelComponent,
                OrderCompleteComponent,
                OrderCompleteConfirmComponent,
                OrderCancelComponent,
                FreightComponent,
                FreightItemComponent,
                FreightDrawerComponent,
                ItemAddComponent,
                ItemEditComponent,
                ItemDetailEditComponent,
                SelectBrandComponent,
                SelectCategoryComponent,
                SelectFreightComponent,
                SelectExpressCompanyComponent
               ],
  exports: [WelcomeComponent],
  entryComponents: [
    OrderEditComponent,
    OrderAddressComponent,
    OrderPayComponent,
    OrderPayConfirmComponent,
    OrderDeliveryComponent,
    OrderCompleteComponent,
    OrderCompleteConfirmComponent,
    OrderCancelComponent]

})
export class WelcomeModule { }
