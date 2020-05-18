import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private msg: NzMessageService) { }

  error(code: number) {
    let message: string;

    switch (code) {
      case 0:
        message = 'SUCCESS';
        break;
    case 1:
        message = '失败';
        break;
    case 118000:
        message = '系统错误';
        break;
    case 118002:
        message = '用户不存在';
        break;
    case 118003:
        message = '参数错误';
        break;
    case 118006:
        message = '访问超时,请重新登录!';
        break;
    case 11807:
        message = '商家不存在!';
        break;
    case 11808:
        message = '密码错误!';
        break;
    case 11809:
        message = '订单不不存在!';
        break;
    case 11100:
        message = '订单状态有误!';
        break;
    case 11101:
        message = '支付金额有误!';
        break;
    case 11102:
        message = '地址信息有误!';
        break;
    case 11103:
        message = '物流模板不存在!';
        break;
    case 11104:
        message = '当前地址无法配送，请选择其他地址!';
        break;

    default:
        message = '系统错误';
        break;
    }

    if(code === 0)
      this.msg.success(message);
    else {
      this.msg.error(message);
    }
  }

}
