import { Injectable } from '@angular/core';
import { LoginData, Result, AuthVo } from '../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

type Callback = (data: any)  => void;

@Injectable({
  providedIn: 'root'
})


export class AuthService implements CanActivate{

  loginUrl: string;

  bizId: string;

  userId: string;

  constructor(private http: HttpClient,
             private router: Router) {
    this.loginUrl = environment.loginUrl;
  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if(!this.check())
      this.router.navigate(['login']);

    return true;
  }

  check() {
    if(this.getBizId() && this.getBizId() !== '') {
      return true;
    }
    else
      return false;
  }


  login(loginData: LoginData, callback: Callback) {
    this.postLogin(loginData).subscribe((meeResult: Result) => {
      if (meeResult.statusCode === 0) {
        const authVo: AuthVo = meeResult.data;
        this.setBizId(authVo.bizId.toString(), loginData.remember);
        this.setuserId(authVo.userId.toString(), loginData.remember);
      }

      callback(meeResult.statusCode);
    });
  }

  private setBizId(bizId: string, remember: boolean ): void {
    this.bizId = bizId;

    if (remember) {
      localStorage.setItem('bizId', bizId);
    }

  }

  private setuserId(userId: string, remember: boolean): void {
    this.userId = userId;
    if (remember) {
      localStorage.setItem('userId', userId);
    }
  }

  public getBizId(): string {
    if (this.bizId) {
      return this.bizId;
    } else {
      return localStorage.getItem('bizId');
    }
  }

  public getUserId(): string {
    if (this.userId) {
      return this.userId;
    } else {
      return localStorage.getItem('userId');    }

  }

  postLogin(data: LoginData) {
    const url = this.loginUrl;
    return this.http.post(url, data);
  }
}
