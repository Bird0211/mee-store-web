import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginData, Result } from '../interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';
import { StatusCodeService } from '../status-code.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  errormsg: string;

  loading = false;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private authService: AuthService,
              private statusCode: StatusCodeService,
              private router: Router
              ) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      code: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    this.loading = true;
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    const data = this.validateForm.value;
    this.authService.login(data, (result: number) => {
      this.loading = false;
      if (result === 0) {
        this.router.navigate(['/welcome']);
      } else {
        this.errormsg = this.statusCode.getErrorMsg(result.toString());
      }
    });
  }

}
