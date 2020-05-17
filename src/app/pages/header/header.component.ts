import { Component, OnInit } from '@angular/core';
import { BizInfo, User } from 'src/app/interface';
import { BizService } from 'src/app/service/biz.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  bizInfo: BizInfo;

  user: User;

  constructor(private bizService: BizService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.bizInfo = this.bizService.getBizInfo();
    this.user = this.userService.getUser();
  }


}
