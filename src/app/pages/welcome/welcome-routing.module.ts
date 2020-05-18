import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { ItemComponent } from '../item/item.component';
import { UserComponent } from '../user/user.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderListComponent } from '../order-list/order-list.component';
import { FreightComponent } from '../freight/freight.component';
import { AuthService } from '../user/auth.service';

const routes: Routes = [
  { path: '', component: WelcomeComponent ,
      children: [
        { path: 'item', component: ItemComponent, canActivate: [AuthService]},
        { path: 'user', component: UserComponent, canActivate: [AuthService]},
        { path: 'freight', component: FreightComponent, canActivate: [AuthService]},
        { path: 'order/:orderId', component: OrderDetailComponent, canActivate: [AuthService]},
        { path: 'order-list', component: OrderListComponent, canActivate: [AuthService]},
      ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
