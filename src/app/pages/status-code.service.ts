import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusCodeService {

  statusCode: Map<string, string> = new Map();

  constructor() {
    this.statusCode.set('0', '成功');
    this.statusCode.set('1', '失败');
    this.statusCode.set('118003', '输入有错、请重新输入');
    this.statusCode.set('11807', '商家不存在');
    this.statusCode.set('118002', '用户不存在');
    this.statusCode.set('11808', '密码错误');
    this.statusCode.set('118000', '系统错误');
   }

  getErrorMsg(errorCode: string): string {
    return this.statusCode.get(errorCode);
  }

}
