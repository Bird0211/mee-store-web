import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ExpressCompany, Result } from '../interface';
import { AuthService } from '../user/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ControlValueAccessor, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from '../error.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-express-company',
  templateUrl: './select-express-company.component.html',
  styleUrls: ['./select-express-company.component.less']
})
export class SelectExpressCompanyComponent implements OnInit {

  expressCompany: ExpressCompany[];

  allExpressUrl: string;

  @Input() selecedComany: string;

  @Output() selecedComanyChange: EventEmitter<string> = new EventEmitter();

  @Input() expressCode: string;

  @Output() expressCodeChange: EventEmitter<string> = new EventEmitter();


  validateForm: FormGroup;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private fb: FormBuilder,
              private errorService: ErrorService) {
                this.allExpressUrl = environment.allExpressUrl;

               }

  ngOnInit(): void {
    this.loadAllExpress();

    this.validateForm = this.fb.group({
      selecedComany: [this.selecedComany, [Validators.required]],
      expressCode: [this.expressCode, [Validators.required]],
    });

  }


  loadAllExpress(){
    this.getAllExpress().subscribe((result: Result) => {
      if(result.statusCode === 0) {
        this.expressCompany = result.data;
      }
    });
  }

  getAllExpress() {
    const url = this.allExpressUrl + '/' + this.authService.getBizId();
    return this.http.get(url);
  }

  companyChange(value: string) {
    this.selecedComanyChange.emit(value);
  }

  codeChange(value: string) {
    this.expressCodeChange.emit(value);
  }

}
